const { Events } = require('discord.js');
const User = require('../../schemas/User');
const getGuildConfig = require('../../utils/getGuildConfig');

const xpCooldowns = new Set();

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        // Custom Prefix Check
        try {
            const config = await getGuildConfig(message.guild.id);
            const prefix = config ? (config.prefix || '!') : '!';
            
            if (message.content.startsWith(prefix)) {
                // If they just typed the prefix by itself, or typed a command
                const args = message.content.slice(prefix.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                
                if (commandName) {
                    return message.reply({ 
                        content: `Hi there! My prefix here is \`${prefix}\`, but I exclusively use modern **Slash Commands (/)**.\n\nPlease type \`/\` in the chat box to see and use all my available commands!`
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching prefix in messageCreate:', err);
        }

        // Cooldown check (1 minute) for XP
        const cooldownKey = `${message.author.id}-${message.guild.id}`;
        if (xpCooldowns.has(cooldownKey)) return;

        try {
            let userData = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
            if (!userData) {
                userData = new User({
                    userId: message.author.id,
                    guildId: message.guild.id,
                });
            }

            const xpToGive = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
            userData.xp += xpToGive;

            // Simple leveling formula: next level = level * 100 xp
            const xpNeeded = userData.level * 100;
            if (userData.xp >= xpNeeded) {
                userData.level += 1;
                userData.xp -= xpNeeded; // Optional: keep remaining xp
                message.channel.send(`🎉 Congratulations ${message.author}, you've leveled up to **Level ${userData.level}**!`);
            }

            await userData.save();

            // Add to cooldown
            xpCooldowns.add(cooldownKey);
            setTimeout(() => {
                xpCooldowns.delete(cooldownKey);
            }, 60000); // 1 minute cooldown

        } catch (error) {
            console.error('Error in messageCreate XP system:', error);
        }
    },
};
