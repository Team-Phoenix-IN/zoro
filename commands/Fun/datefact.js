const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('datefact')
        .setDescription('Get an interesting historical trivia fact about a random date.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('http://numbersapi.com/random/date?json');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x9B59B6)
                .setTitle('📅 Date Fact')
                .setDescription(data.text)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Date Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a date fact right now.' });
        }
    }
};
