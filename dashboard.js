require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const GuildConfig = require('./schemas/GuildConfig');
const AutoResponder = require('./schemas/AutoResponder');
const StickyMessage = require('./schemas/StickyMessage');
const ButtonRolePanel = require('./schemas/ButtonRolePanel');
const BannedWord = require('./schemas/BannedWord');
const ShopItem = require('./schemas/ShopItem');
const Warning = require('./schemas/Warning');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Static command registry ────────────────────────────────────────────────
// Keep this in sync with your commands directory.
const fs = require('fs');
const COMMAND_REGISTRY = [];

function loadCommands(dir, category) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const formattedCategory = file.charAt(0).toUpperCase() + file.slice(1);
            loadCommands(fullPath, formattedCategory);
        } else if (file.endsWith('.js')) {
            try {
                const command = require(path.resolve(fullPath));
                if (command.data && command.data.name && command.data.description) {
                    COMMAND_REGISTRY.push({
                        name: command.data.name,
                        category: category,
                        description: command.data.description
                    });
                }
            } catch (err) {
                // Ignore errors reading individual files
            }
        }
    }
}
loadCommands(path.join(__dirname, 'commands'), 'Uncategorized');

// ── MongoDB ────────────────────────────────────────────────────────────────
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Dashboard connected to MongoDB.'))
        .catch(err => console.error('Failed to connect to MongoDB:', err));
}

// ── Passport ───────────────────────────────────────────────────────────────
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    return done(null, profile);
}));

// ── Express middleware ─────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'super_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

app.use((req, res, next) => {
    res.locals.process = process;
    next();
});

// ── Helper: verify the authed user has MANAGE_GUILD (0x20) on guildId ──────
async function verifyUserGuild(req, guildId) {
    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${req.user.accessToken}` }
    });
    const guild = response.data.find(g => g.id === guildId);
    if (!guild || (guild.permissions & 0x20) !== 0x20) return null;
    return guild;
}

// ── Page routes ────────────────────────────────────────────────────────────
app.get('/', async (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/dashboard');
    let botServerCount = '—';
    try {
        const botRes = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
        });
        botServerCount = botRes.data.length;
    } catch (err) {
        console.error('Failed to fetch bot servers for index page:', err.message);
    }
    res.render('index', { 
        botServerCount, 
        commandsCount: COMMAND_REGISTRY.length 
    });
});

app.get('/auth/login', (req, res) => res.redirect('/auth/discord'));

app.get('/dashboard', checkAuth, async (req, res) => {
    try {
        const userRes = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${req.user.accessToken}` }
        });
        const manageServerGuilds = userRes.data.filter(g => (g.permissions & 0x20) === 0x20);

        const botRes = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
        });
        const botGuildIds = new Set(botRes.data.map(g => g.id));

        let botConfigs = [];
        try { botConfigs = await GuildConfig.find({}); } catch (_) {}

        const guilds = manageServerGuilds.map(guild => {
            const config = botConfigs.find(c => c.guildId === guild.id);
            return {
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                hasBot: botGuildIds.has(guild.id),
                automodEnabled: config ? config.automodEnabled : false
            };
        });

        res.render('dashboard', {
            is_logged: true,
            user: req.user,
            bot: { username: 'Zoro V3' },
            guilds
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading dashboard');
    }
});

// ── OAuth2 ─────────────────────────────────────────────────────────────────
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => res.redirect('/dashboard'));

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.redirect('/');
        res.redirect('/');
    });
});

// ══════════════════════════════════════════════════════════════════════════
//   API ROUTES
// ══════════════════════════════════════════════════════════════════════════

// GET /api/guilds — list of guilds user can manage
app.get('/api/guilds', checkAuth, async (req, res) => {
    try {
        const userRes = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${req.user.accessToken}` }
        });
        const manageServerGuilds = userRes.data.filter(g => (g.permissions & 0x20) === 0x20);

        const botRes = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
        });
        const botGuildIds = new Set(botRes.data.map(g => g.id));

        let botConfigs = [];
        try { botConfigs = await GuildConfig.find({}); } catch (_) {}

        const result = manageServerGuilds.map(guild => {
            const config = botConfigs.find(c => c.guildId === guild.id);
            return {
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                hasBot: botGuildIds.has(guild.id),
                automodEnabled: config ? config.automodEnabled : false
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching guilds:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch guilds' });
    }
});

// GET /api/guilds/:id/config — full guild config for the settings panel
app.get('/api/guilds/:id/config', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });

        let config = await GuildConfig.findOne({ guildId });

        res.json({
            commands:   COMMAND_REGISTRY,
            prefix:     config ? (config.prefix || '!') : '!',
            disabled:   config ? (config.disabledCommands || []) : [],
            automod: {
                enabled:      config ? config.automodEnabled : false,
                logChannelId: config ? config.logChannelId   : null,
            },
            verification: {
                channelId: config ? config.verificationChannelId : null,
                roleId:    config ? config.verificationRoleId    : null,
            },
            welcome: {
                welcomeChannelId: config ? config.welcomeChannelId : null,
                welcomeMessage:   config ? config.welcomeMessage   : 'Welcome {user} to {server}!',
                leaveChannelId:   config ? config.leaveChannelId   : null,
                leaveMessage:     config ? config.leaveMessage     : '{user} has left the server.',
            },
            leveling: {
                enabled:          config ? config.levelingEnabled  : false,
                levelUpChannelId: config ? config.levelUpChannelId : null,
            },
            tickets: {
                categoryId:     config ? config.ticketCategoryId    : null,
                supportRoleId:  config ? config.ticketSupportRoleId : null,
                logChannelId:   config ? config.ticketLogChannelId  : null,
            },
            suggestions: {
                channelId: config ? config.suggestionChannelId : null,
            },
            voice: {
                voiceGeneratorId: config ? config.voiceGeneratorId : null,
                voiceCategoryId:  config ? config.voiceCategoryId  : null,
            },
            birthdays: {
                birthdayChannelId: config ? config.birthdayChannelId : null,
                birthdayMessage:   config ? config.birthdayMessage   : 'Happy Birthday {user}! 🎉',
            },
            stats: {
                enabled: config ? config.statsEnabled : false,
            }
        });
    } catch (error) {
        console.error('Error fetching guild config:', error.message);
        res.status(500).json({ error: 'Failed to fetch config' });
    }
});

// POST /api/guilds/:id/automod — toggle automod + optional log channel
app.post('/api/guilds/:id/automod', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { enabled, logChannelId } = req.body;

    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });

        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found in database. Add the bot first.' });

        config.automodEnabled = !!enabled;
        if (logChannelId !== undefined) config.logChannelId = logChannelId || null;
        await config.save();

        res.json({ success: true, automodEnabled: config.automodEnabled, logChannelId: config.logChannelId });
    } catch (error) {
        console.error('Error updating automod:', error.message);
        res.status(500).json({ error: 'Failed to update automod setting' });
    }
});

// POST /api/guilds/:id/commands — save disabled command list
app.post('/api/guilds/:id/commands', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { disabledCommands, prefix } = req.body;

    if (!Array.isArray(disabledCommands)) {
        return res.status(400).json({ error: 'disabledCommands must be an array' });
    }

    const validNames = new Set(COMMAND_REGISTRY.map(c => c.name));
    const sanitized = disabledCommands.filter(n => validNames.has(n));

    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });

        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found in database. Add the bot first.' });

        config.disabledCommands = sanitized;
        if (prefix && prefix.length > 0 && prefix.length <= 5) {
            config.prefix = prefix;
        }
        await config.save();

        res.json({ success: true, disabledCommands: config.disabledCommands, prefix: config.prefix });
    } catch (error) {
        console.error('Error updating commands:', error.message);
        res.status(500).json({ error: 'Failed to update command settings' });
    }
});

// POST /api/guilds/:id/verification — save verification channel + role IDs, optionally send embed
app.post('/api/guilds/:id/verification', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { channelId, roleId, sendEmbed } = req.body;

    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });

        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found in database. Add the bot first.' });

        config.verificationChannelId = channelId || null;
        config.verificationRoleId    = roleId    || null;
        await config.save();

        // Optionally send the verification embed via the bot token
        if (sendEmbed && channelId && roleId) {
            try {
                await axios.post(
                    `https://discord.com/api/v10/channels/${channelId}/messages`,
                    {
                        embeds: [{
                            title: 'Server Verification',
                            description: 'Welcome to the server!\nClick the **Verify** button below to gain access.',
                            color: 0x57f287
                        }],
                        components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                style: 3,        // SUCCESS (green)
                                label: 'Verify',
                                emoji: { name: '✅' },
                                custom_id: `verify_${roleId}`
                            }]
                        }]
                    },
                    { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` } }
                );
            } catch (discordErr) {
                const msg = discordErr.response?.data?.message || discordErr.message;
                return res.status(502).json({ error: `Config saved, but failed to send embed: ${msg}` });
            }
        }

        res.json({ success: true, channelId: config.verificationChannelId, roleId: config.verificationRoleId });
    } catch (error) {
        console.error('Error updating verification:', error.message);
        res.status(500).json({ error: 'Failed to update verification settings' });
    }
});

// POST /api/guilds/:id/welcome
app.post('/api/guilds/:id/welcome', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { welcomeChannelId, welcomeMessage, leaveChannelId, leaveMessage } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found.' });

        config.welcomeChannelId = welcomeChannelId || null;
        config.welcomeMessage   = welcomeMessage || 'Welcome {user} to {server}!';
        config.leaveChannelId   = leaveChannelId || null;
        config.leaveMessage     = leaveMessage || '{user} has left the server.';
        await config.save();
        res.json({ success: true, welcome: config });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update welcome settings' });
    }
});

// POST /api/guilds/:id/leveling
app.post('/api/guilds/:id/leveling', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { enabled, levelUpChannelId } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found.' });

        config.levelingEnabled  = !!enabled;
        config.levelUpChannelId = levelUpChannelId || null;
        await config.save();
        res.json({ success: true, leveling: config });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update leveling settings' });
    }
});

// POST /api/guilds/:id/tickets
app.post('/api/guilds/:id/tickets', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { categoryId, supportRoleId, logChannelId } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found.' });

        config.ticketCategoryId    = categoryId || null;
        config.ticketSupportRoleId = supportRoleId || null;
        config.ticketLogChannelId  = logChannelId || null;
        await config.save();
        res.json({ success: true, tickets: config });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket settings' });
    }
});

// POST /api/guilds/:id/suggestions
app.post('/api/guilds/:id/suggestions', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { channelId } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found.' });

        config.suggestionChannelId = channelId || null;
        await config.save();
        res.json({ success: true, suggestions: config });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update suggestions config' });
    }
});

// GET /api/guilds/:id/autoresponders
app.get('/api/guilds/:id/autoresponders', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        const responders = await AutoResponder.find({ guildId });
        res.json(responders);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch auto-responders' }); }
});

// POST /api/guilds/:id/autoresponders
app.post('/api/guilds/:id/autoresponders', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { trigger, response } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        if (!trigger || !response) return res.status(400).json({ error: 'Trigger and response required.' });
        
        const ar = await AutoResponder.create({ guildId, trigger, response });
        res.json({ success: true, autoResponder: ar });
    } catch (err) { res.status(500).json({ error: 'Failed to create auto-responder' }); }
});

// DELETE /api/guilds/:id/autoresponders/:arId
app.delete('/api/guilds/:id/autoresponders/:arId', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        await AutoResponder.findOneAndDelete({ _id: req.params.arId, guildId });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

// GET /api/guilds/:id/stickymessages
app.get('/api/guilds/:id/stickymessages', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        const stickies = await StickyMessage.find({ guildId });
        res.json(stickies);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch sticky messages' }); }
});

// POST /api/guilds/:id/stickymessages
app.post('/api/guilds/:id/stickymessages', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { channelId, content } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        if (!channelId || !content) return res.status(400).json({ error: 'Channel ID and content required.' });
        
        // Only one sticky per channel max
        await StickyMessage.findOneAndDelete({ guildId, channelId });
        
        const sm = await StickyMessage.create({ guildId, channelId, content });
        res.json({ success: true, stickyMessage: sm });
    } catch (err) { res.status(500).json({ error: 'Failed to create sticky message' }); }
});

// DELETE /api/guilds/:id/stickymessages/:smId
app.delete('/api/guilds/:id/stickymessages/:smId', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        await StickyMessage.findOneAndDelete({ _id: req.params.smId, guildId });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

// POST /api/guilds/:id/voice
app.post('/api/guilds/:id/voice', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { voiceGeneratorId, voiceCategoryId } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found.' });

        config.voiceGeneratorId = voiceGeneratorId || null;
        config.voiceCategoryId  = voiceCategoryId  || null;
        await config.save();
        res.json({ success: true, voice: config });
    } catch (error) { res.status(500).json({ error: 'Failed to update voice config' }); }
});

// POST /api/guilds/:id/birthdays
app.post('/api/guilds/:id/birthdays', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { birthdayChannelId, birthdayMessage } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found.' });

        config.birthdayChannelId = birthdayChannelId || null;
        config.birthdayMessage   = birthdayMessage || 'Happy Birthday {user}! 🎉';
        await config.save();
        res.json({ success: true, birthdays: config });
    } catch (error) { res.status(500).json({ error: 'Failed to update birthday config' }); }
});

// GET /api/guilds/:id/buttonroles
app.get('/api/guilds/:id/buttonroles', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        const panels = await ButtonRolePanel.find({ guildId });
        res.json(panels);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch panels' }); }
});

// POST /api/guilds/:id/buttonroles
app.post('/api/guilds/:id/buttonroles', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { channelId, title, description, buttons } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        if (!channelId || !buttons || !buttons.length) return res.status(400).json({ error: 'Channel ID and at least 1 button required.' });
        
        const panel = await ButtonRolePanel.create({ guildId, channelId, title, description, buttons });
        res.json({ success: true, panel });
    } catch (err) { res.status(500).json({ error: 'Failed to create panel' }); }
});

// DELETE /api/guilds/:id/buttonroles/:panelId
app.delete('/api/guilds/:id/buttonroles/:panelId', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        await ButtonRolePanel.findOneAndDelete({ _id: req.params.panelId, guildId });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Failed to delete panel' }); }
});

// POST /api/guilds/:id/buttonroles/:panelId/send
app.post('/api/guilds/:id/buttonroles/:panelId/send', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        
        const panel = await ButtonRolePanel.findOne({ _id: req.params.panelId, guildId });
        if (!panel) return res.status(404).json({ error: 'Panel not found' });

        // Build Discord components
        const components = [{
            type: 1, // ActionRow
            components: panel.buttons.map((btn, i) => ({
                type: 2, // Button
                style: btn.style || 1,
                label: btn.label,
                emoji: { name: btn.emoji || '🏷️' },
                custom_id: `btnrole_${panel._id}_${i}` // We will parse this in the interaction handler
            }))
        }];

        // Send to Discord via API
        const response = await axios.post(
            `https://discord.com/api/v10/channels/${panel.channelId}/messages`,
            {
                embeds: [{
                    title: panel.title,
                    description: panel.description,
                    color: 0x5865F2
                }],
                components: components
            },
            { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` } }
        );

        panel.messageId = response.data.id;
        await panel.save();

        res.json({ success: true, messageId: panel.messageId });
    } catch (err) { 
        console.error('Discord API Error:', err.response?.data || err.message);
        res.status(502).json({ error: 'Failed to send embed to Discord. Check channel ID and permissions.' }); 
    }
});

// POST /api/guilds/:id/stats
app.post('/api/guilds/:id/stats', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { enabled } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        let config = await GuildConfig.findOne({ guildId });
        if (!config) return res.status(404).json({ error: 'Guild not found.' });

        // Note: the bot event listener will handle the actual channel creation/deletion
        // Here we just save the intent.
        config.statsEnabled = !!enabled;
        
        // If they disable it, we could clear the IDs here, or let the bot do it.
        if (!enabled) {
            config.statsCategoryId = null;
            config.statsMemberChannelId = null;
            config.statsBotChannelId = null;
        }

        await config.save();

        // Also trigger the bot to update stats channels immediately if possible
        // We'll dispatch an event or the bot will catch it on next interval.
        // For now, simple save.
        res.json({ success: true, stats: config });
    } catch (error) { res.status(500).json({ error: 'Failed to update stats config' }); }
});

// GET /api/guilds/:id/bannedwords
app.get('/api/guilds/:id/bannedwords', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        const words = await BannedWord.find({ guildId });
        res.json(words);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch banned words' }); }
});

// POST /api/guilds/:id/bannedwords
app.post('/api/guilds/:id/bannedwords', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { word } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        if (!word) return res.status(400).json({ error: 'Word required.' });
        
        const bw = await BannedWord.create({ guildId, word: word.toLowerCase() });
        res.json({ success: true, word: bw });
    } catch (err) { res.status(500).json({ error: 'Failed to add banned word' }); }
});

// DELETE /api/guilds/:id/bannedwords/:wordId
app.delete('/api/guilds/:id/bannedwords/:wordId', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        await BannedWord.findOneAndDelete({ _id: req.params.wordId, guildId });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

// GET /api/guilds/:id/shopitems
app.get('/api/guilds/:id/shopitems', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        const items = await ShopItem.find({ guildId });
        res.json(items);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch shop items' }); }
});

// POST /api/guilds/:id/shopitems
app.post('/api/guilds/:id/shopitems', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { name, description, price, roleId } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        if (!name || !price || !roleId) return res.status(400).json({ error: 'Name, price, and roleId required.' });
        
        const item = await ShopItem.create({ guildId, name, description: description||'', price, roleId });
        res.json({ success: true, item });
    } catch (err) { res.status(500).json({ error: 'Failed to add shop item' }); }
});

// DELETE /api/guilds/:id/shopitems/:itemId
app.delete('/api/guilds/:id/shopitems/:itemId', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        await ShopItem.findOneAndDelete({ _id: req.params.itemId, guildId });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

// GET /api/guilds/:id/warnings?userId=123
app.get('/api/guilds/:id/warnings', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const userId = req.query.userId;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        
        if (!userId) return res.json([]);
        const warnings = await Warning.find({ guildId, userId }).sort({ timestamp: -1 });
        res.json(warnings);
    } catch (err) { res.status(500).json({ error: 'Failed to fetch warnings' }); }
});

// DELETE /api/guilds/:id/warnings/:warningId
app.delete('/api/guilds/:id/warnings/:warningId', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        await Warning.findOneAndDelete({ _id: req.params.warningId, guildId });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Failed to delete warning' }); }
});

// POST /api/guilds/:id/announcer/send
app.post('/api/guilds/:id/announcer/send', checkAuth, async (req, res) => {
    const guildId = req.params.id;
    const { channelId, title, description, color, imageUrl } = req.body;
    try {
        const userGuild = await verifyUserGuild(req, guildId);
        if (!userGuild) return res.status(403).json({ error: 'Unauthorized' });
        if (!channelId || !title || !description) return res.status(400).json({ error: 'Channel ID, title, and description required.' });

        const embedColor = color ? parseInt(color.replace('#', ''), 16) : 0x5865F2;

        const embedPayload = {
            title,
            description,
            color: embedColor
        };
        
        if (imageUrl) {
            embedPayload.image = { url: imageUrl };
        }

        const response = await axios.post(
            `https://discord.com/api/v10/channels/${channelId}/messages`,
            { embeds: [embedPayload] },
            { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` } }
        );

        res.json({ success: true, messageId: response.data.id });
    } catch (err) { 
        console.error('Discord API Error:', err.response?.data || err.message);
        res.status(502).json({ error: 'Failed to send announcement. Check channel ID and permissions.' }); 
    }
});

// ── Start ──────────────────────────────────────────────────────────────────
const https = require('https');

const keyPath = path.join(__dirname, 'key.pem');
const certPath = path.join(__dirname, 'cert.pem');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    // Run securely with Cloudflare Origin Certificates
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT, '0.0.0.0', () => {
        console.log(`Secure Dashboard (HTTPS) listening on port ${PORT}`);
    });
} else {
    // Fallback to standard HTTP for local testing
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Dashboard (HTTP) listening on port ${PORT}`);
        console.log(`⚠️ Note: key.pem or cert.pem not found. Running in standard HTTP mode.`);
    });
}
