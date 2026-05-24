const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = (client) => {
    client.on('messageDelete', async (message) => {
        if (message.author?.bot || !message.guild) return;

        try {
            const config = await GuildConfig.findOne({ guildId: message.guild.id });
            if (!config || !config.logChannelId) return;

            const logChannel = message.guild.channels.cache.get(config.logChannelId);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTitle('Message Deleted')
                .addFields(
                    { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
                    { name: 'Author', value: `<@${message.author.id}>`, inline: true },
                    { name: 'Content', value: message.content || '*No text content*' }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error logging message delete:', error);
        }
    });
};
