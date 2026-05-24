const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random inspirational or funny anime quote.'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://some-random-api.com/animu/quote');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x9B59B6) // Purple
                .setTitle(`Quote from ${data.anime}`)
                .setDescription(`*"${data.sentence}"*`)
                .setFooter({ text: `- ${data.character}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Quote API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a quote right now.' });
        }
    }
};
