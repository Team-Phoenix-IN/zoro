const { Events, REST, Routes } = require('discord.js');
const Birthday = require('../../schemas/Birthday');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // Register slash commands automatically when ready
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        try {
            console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

            // Group commands by category
            const commandsByCategory = {};
            client.commands.forEach(cmd => {
                const cat = (cmd.category || 'general').toLowerCase();
                if (!commandsByCategory[cat]) commandsByCategory[cat] = [];
                commandsByCategory[cat].push(cmd);
            });

            const rootCommands = [];

            for (const [cat, cmds] of Object.entries(commandsByCategory)) {
                // Sort alphabetically by command name
                cmds.sort((a, b) => a.data.name.localeCompare(b.data.name));

                // Chunk into arrays of 25
                for (let i = 0; i < cmds.length; i += 25) {
                    const chunk = cmds.slice(i, i + 25);
                    
                    let rootName = cat;
                    if (cmds.length > 25) {
                        const firstChar = chunk[0].data.name.charAt(0).toLowerCase();
                        const lastChar = chunk[chunk.length - 1].data.name.charAt(0).toLowerCase();
                        rootName = `${cat}_${firstChar}_${lastChar}`;
                        // Ensure max 32 chars and valid format
                        rootName = rootName.replace(/[^a-z0-9_]/g, '').substring(0, 32);
                    }

                    const rootCommand = {
                        name: rootName,
                        description: `Commands for ${cat} (${i + 1}-${i + chunk.length})`,
                        options: chunk.map(cmd => {
                            const json = cmd.data.toJSON();
                            let type = 1; // SUB_COMMAND
                            // If the command already has subcommands, it becomes a SUB_COMMAND_GROUP
                            if (json.options && json.options.some(opt => opt.type === 1)) {
                                type = 2; // SUB_COMMAND_GROUP
                            }
                            return {
                                type: type,
                                name: json.name,
                                description: json.description,
                                options: json.options || []
                            };
                        })
                    };
                    rootCommands.push(rootCommand);
                }
            }

            console.log(`Grouped into ${rootCommands.length} root commands.`);

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: rootCommands },
            );

            console.log(`Successfully reloaded application (/) commands.`);
        } catch (error) {
            console.error(error);
        }

        // Start Birthday Checker Interval (Runs once every 24 hours)
        // For testing/reliability, we'll check once an hour but only announce if we haven't today.
        // A simple implementation: check every 24h
        setInterval(async () => {
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();

            try {
                // Find all birthdays today
                const birthdaysToday = await Birthday.find({ month: currentMonth, day: currentDay });
                
                for (const bday of birthdaysToday) {
                    const config = await GuildConfig.findOne({ guildId: bday.guildId });
                    if (!config || !config.birthdayChannelId) continue;

                    const guild = client.guilds.cache.get(bday.guildId);
                    if (!guild) continue;

                    const channel = guild.channels.cache.get(config.birthdayChannelId);
                    if (!channel) continue;

                    // We could track if we already sent it today in the DB to prevent duplicates on bot restart
                    // But for simplicity in this version, we assume continuous uptime.
                    
                    let msg = config.birthdayMessage || 'Happy Birthday {user}! 🎉';
                    msg = msg.replace(/{user}/g, `<@${bday.userId}>`);
                    
                    channel.send(msg).catch(err => console.error('Failed to send birthday msg:', err));
                }
            } catch (err) {
                console.error('Error checking birthdays:', err);
            }
        }, 24 * 60 * 60 * 1000); // 24 hours
        
        console.log('Started birthday check interval.');
    },
};
