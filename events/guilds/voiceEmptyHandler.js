const { Events } = require('discord.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    async execute(oldState, newState, client) {
        // Only proceed if someone actually left a channel or moved to a different channel
        if (oldState.channelId && oldState.channelId !== newState.channelId) {
            const botVoiceChannel = oldState.guild.members.me.voice.channel;
            
            // Check if the bot is in a voice channel, and if the user left that exact channel
            if (botVoiceChannel && oldState.channelId === botVoiceChannel.id) {
                // Filter members in the channel to see if any real humans are left
                const realMembers = botVoiceChannel.members.filter(m => !m.user.bot);
                
                if (realMembers.size === 0) {
                    // Start a 15-second timer before disconnecting
                    setTimeout(() => {
                        // Check the channel members one more time to ensure no one instantly rejoined
                        const currentMembers = botVoiceChannel.members.filter(m => !m.user.bot);
                        if (currentMembers.size === 0) {
                            const queue = client.distube.getQueue(oldState.guild);
                            if (queue) {
                                queue.textChannel?.send('🚪 | Everyone left the voice channel. Stopping the music and clearing the queue!').catch(() => {});
                                queue.stop(); 
                            }
                            // Forcefully leave the voice channel
                            client.distube.voices.leave(oldState.guild);
                        }
                    }, 15000); // 15,000 ms = 15 seconds
                }
            }
        }
    }
};
