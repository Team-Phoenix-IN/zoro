const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcstatus')
        .setDescription('Check Minecraft server status.')
        .addStringOption(option => option.setName('ip').setDescription('Server IP Address').setRequired(true)),
    async execute(interaction) {
        const ip = interaction.options.getString('ip');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.mcsrvstat.us/2/${ip}`);
            const data = response.data;

            if (!data.online) {
                return interaction.editReply({ content: `The server **${ip}** is currently offline or unreachable.` });
            }

            const embed = new EmbedBuilder()
                .setTitle(`Minecraft Server: ${ip}`)
                .setColor('Green')
                .addFields(
                    { name: 'Status', value: '🟢 Online', inline: true },
                    { name: 'Players', value: `${data.players.online}/${data.players.max}`, inline: true },
                    { name: 'Version', value: data.version || 'Unknown', inline: true },
                    { name: 'MOTD', value: data.motd?.clean?.join('\n') || 'No MOTD' }
                );

            if (data.icon) {
                // The icon is base64
                embed.setThumbnail(`https://api.mcsrvstat.us/icon/${ip}`);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply({ content: 'An error occurred while fetching the server status.' });
        }
    },
};
