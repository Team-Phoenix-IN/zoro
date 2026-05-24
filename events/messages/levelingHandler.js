const Level = require('../../schemas/Level');
const GuildConfig = require('../../schemas/GuildConfig');

// Cooldown tracker (in memory) to prevent spamming XP
// Set containing "guildId-userId" strings
const xpCooldowns = new Set();

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        // Ignore bots and DM messages
        if (message.author.bot || !message.guild) return;

        const guildId = message.guild.id;
        const userId = message.author.id;
        const cooldownKey = `${guildId}-${userId}`;

        // Check cooldown (e.g., 60 seconds)
        if (xpCooldowns.has(cooldownKey)) return;

        try {
            // Check if leveling is enabled
            const config = await GuildConfig.findOne({ guildId });
            if (!config || !config.levelingEnabled) return;

            // Generate random XP between 15 and 25
            const xpToAdd = Math.floor(Math.random() * 11) + 15;

            // Find or create user level
            let userLevel = await Level.findOne({ guildId, userId });
            if (!userLevel) {
                userLevel = new Level({ guildId, userId });
            }

            userLevel.xp += xpToAdd;

            // Calculate needed XP for next level (simple formula: level * 100)
            // e.g., to reach level 1 requires 100 XP, level 2 requires 200 XP, etc.
            // Let's use a standard formula: 5 * (level ^ 2) + (50 * level) + 100
            const nextLevelXp = 5 * Math.pow(userLevel.level, 2) + 50 * userLevel.level + 100;

            let leveledUp = false;
            if (userLevel.xp >= nextLevelXp) {
                userLevel.level += 1;
                userLevel.xp -= nextLevelXp; // carry over remaining XP
                leveledUp = true;
            }

            await userLevel.save();

            // Handle level up message
            if (leveledUp) {
                const levelUpMsg = `🎉 Congratulations <@${userId}>, you just advanced to level **${userLevel.level}**!`;
                
                if (config.levelUpChannelId) {
                    const logChannel = message.guild.channels.cache.get(config.levelUpChannelId);
                    if (logChannel) {
                        logChannel.send(levelUpMsg).catch(console.error);
                    }
                } else {
                    // Send in the same channel if no specific channel is set
                    message.channel.send(levelUpMsg).catch(console.error);
                }
            }

            // Apply cooldown
            xpCooldowns.add(cooldownKey);
            setTimeout(() => {
                xpCooldowns.delete(cooldownKey);
            }, 60000); // 60 seconds

        } catch (error) {
            console.error('Error handling leveling:', error);
        }
    });
};
