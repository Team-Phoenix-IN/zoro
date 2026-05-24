const GuildConfig = require('../../schemas/GuildConfig');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        try {
            const config = await GuildConfig.findOne({ guildId: member.guild.id });
            if (!config || !config.welcomeChannelId) return;

            const channel = member.guild.channels.cache.get(config.welcomeChannelId);
            if (!channel) return;

            // Replace variables
            let msg = config.welcomeMessage || 'Welcome {user} to {server}!';
            msg = msg.replace(/{user}/g, `<@${member.id}>`)
                     .replace(/{server}/g, member.guild.name)
                     .replace(/{count}/g, member.guild.memberCount);

            channel.send(msg).catch(console.error);
        } catch (error) {
            console.error('Error in guildMemberAdd:', error);
        }
    });
};
