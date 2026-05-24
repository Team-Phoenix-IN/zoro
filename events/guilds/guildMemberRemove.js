const GuildConfig = require('../../schemas/GuildConfig');

module.exports = (client) => {
    client.on('guildMemberRemove', async (member) => {
        try {
            const config = await GuildConfig.findOne({ guildId: member.guild.id });
            if (!config || !config.leaveChannelId) return;

            const channel = member.guild.channels.cache.get(config.leaveChannelId);
            if (!channel) return;

            // Replace variables
            let msg = config.leaveMessage || '{user} has left the server.';
            msg = msg.replace(/{user}/g, member.user.username)
                     .replace(/{server}/g, member.guild.name)
                     .replace(/{count}/g, member.guild.memberCount);

            channel.send(msg).catch(console.error);
        } catch (error) {
            console.error('Error in guildMemberRemove:', error);
        }
    });
};
