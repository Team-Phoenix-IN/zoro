const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('motivation')
        .setDescription('Receive a powerful motivational quote.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://zenquotes.io/api/random');
            const data = response.data[0];

            const embed = new EmbedBuilder()
                .setColor(0x3498DB) // Blue
                .setTitle('Motivation')
                .setDescription(`*"${data.q}"*\n\n— **${data.a}**`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Motivation API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a quote right now.' });
        }
    }
};
