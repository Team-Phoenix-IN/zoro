const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = (client) => {
    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (newMessage.author?.bot || !newMessage.guild) return;
        
        // Ensure content actually changed (not just an embed loading)
        if (oldMessage.content === newMessage.content) return;

        try {
            const config = await GuildConfig.findOne({ guildId: newMessage.guild.id });
            if (!config || !config.logChannelId) return;

            const logChannel = newMessage.guild.channels.cache.get(config.logChannelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL() })
                .setTitle('Message Edited')
                .addFields(
                    { name: 'Channel', value: `<#${newMessage.channel.id}>`, inline: true },
                    { name: 'Author', value: `<@${newMessage.author.id}>`, inline: true },
                    { name: 'Before', value: oldMessage.content || '*No text content*' },
                    { name: 'After', value: newMessage.content || '*No text content*' }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error logging message update:', error);
        }
    });
};
