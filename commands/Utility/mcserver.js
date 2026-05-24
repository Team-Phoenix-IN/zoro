const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcserver')
        .setDescription('Check the status of a Minecraft server.')
        .addStringOption(option => 
            option.setName('ip')
                .setDescription('The IP address of the Minecraft server')
                .setRequired(true)
        ),
    async execute(interaction) {
        const ip = interaction.options.getString('ip');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.mcsrvstat.us/2/${encodeURIComponent(ip)}`);
            const data = response.data;

            if (!data.online) {
                return interaction.editReply({ content: `The Minecraft server **${ip}** is currently offline or cannot be reached.` });
            }

            const embed = new EmbedBuilder()
                .setColor(0x2ECC71) // Green
                .setTitle(`Minecraft Server: ${ip}`)
                .setThumbnail(`https://api.mcsrvstat.us/icon/${encodeURIComponent(ip)}`)
                .addFields(
                    { name: 'Status', value: '🟢 Online', inline: true },
                    { name: 'Players', value: `${data.players.online} / ${data.players.max}`, inline: true },
                    { name: 'Version', value: data.version || 'Unknown', inline: true },
                    { name: 'MOTD', value: data.motd ? data.motd.clean.join('\n') : 'No MOTD', inline: false }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Minecraft API Error:', error);
            await interaction.editReply({ content: 'An error occurred while checking the server status.' });
        }
    }
};
