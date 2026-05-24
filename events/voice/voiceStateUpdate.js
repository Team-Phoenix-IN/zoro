const { ChannelType, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');

// In-memory set of channel IDs that were created by the bot
// This ensures we only delete channels we actually created
const tempChannels = new Set();

module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        try {
            // Fetch config
            const config = await GuildConfig.findOne({ guildId: newState.guild.id });
            if (!config || !config.voiceGeneratorId) return;

            // JOIN EVENT
            if (newState.channelId === config.voiceGeneratorId) {
                // User joined the generator channel
                const user = newState.member.user;
                const categoryId = config.voiceCategoryId || newState.channel?.parentId;

                const newChannel = await newState.guild.channels.create({
                    name: `${user.username}'s VC`,
                    type: ChannelType.GuildVoice,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers],
                        }
                    ]
                });

                // Move user to the new channel
                await newState.setChannel(newChannel);
                
                // Track this temporary channel
                tempChannels.add(newChannel.id);
            }

            // LEAVE EVENT
            // If the user left a channel, check if it's a temporary one
            if (oldState.channelId && oldState.channelId !== newState.channelId) {
                const oldChannel = oldState.channel;
                
                if (oldChannel && tempChannels.has(oldChannel.id)) {
                    // Check if channel is empty
                    if (oldChannel.members.size === 0) {
                        try {
                            await oldChannel.delete();
                            tempChannels.delete(oldChannel.id);
                        } catch (err) {
                            console.error('Failed to delete temp voice channel:', err);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in voiceStateUpdate:', error);
        }
    });
};
