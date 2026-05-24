const { Events } = require('discord.js');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        try {
            const config = await getGuildConfig(message.guild.id);

            // Ignore messages not in the designated counting channel
            if (!config.countingChannelId || message.channel.id !== config.countingChannelId) return;

            const content = message.content.trim();
            const number = parseInt(content, 10);

            // Not a valid standalone number
            if (isNaN(number) || content !== number.toString()) {
                // Delete non-number messages to keep the channel clean
                if (message.deletable) {
                    await message.delete().catch(() => {});
                }
                return;
            }

            const expectedNumber = config.currentCount + 1;

            if (number === expectedNumber && message.author.id !== config.lastCounterId) {
                // Valid count
                config.currentCount = number;
                config.lastCounterId = message.author.id;
                await config.save();

                await message.react('✅').catch(() => {});
            } else {
                // Invalid count or same user counted twice
                config.currentCount = 0;
                config.lastCounterId = null;
                await config.save();

                await message.react('❌').catch(() => {});
                
                let failMessage = `❌ **${message.author} ruined the count!** `;
                if (number !== expectedNumber) {
                    failMessage += `The next number was supposed to be **${expectedNumber}**.`;
                } else {
                    failMessage += `You cannot count twice in a row.`;
                }
                failMessage += `\nThe count has been reset to **0**. The next number is **1**.`;

                await message.channel.send(failMessage);

                // Handle the fail role if configured
                if (config.countingFailRoleId) {
                    try {
                        const failRole = message.guild.roles.cache.get(config.countingFailRoleId) || await message.guild.roles.fetch(config.countingFailRoleId).catch(() => null);
                        if (failRole) {
                            await message.member.roles.add(failRole);
                            message.channel.send(`*${message.author} has been given the \`${failRole.name}\` role for ${config.countingFailTimeMinutes} minutes as a penalty.*`);
                            
                            // Remove role after timeout
                            setTimeout(async () => {
                                // Re-fetch member to ensure they are still in the guild
                                const member = await message.guild.members.fetch(message.author.id).catch(() => null);
                                if (member && member.roles.cache.has(failRole.id)) {
                                    await member.roles.remove(failRole).catch(console.error);
                                }
                            }, config.countingFailTimeMinutes * 60 * 1000);
                        }
                    } catch (err) {
                        console.error('Failed to assign fail role:', err);
                        message.channel.send(`*I tried to give ${message.author} the fail role, but I don't have permission! Make sure my role is higher than the fail role.*`).catch(() => {});
                    }
                }
            }

        } catch (error) {
            console.error('Error in counting handler:', error);
        }
    },
};
