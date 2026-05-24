const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yearfact')
        .setDescription('Get an interesting historical trivia fact about a specific year.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('http://numbersapi.com/random/year?json');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xE67E22)
                .setTitle('⏳ Year Fact')
                .setDescription(data.text)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Year Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a year fact right now.' });
        }
    }
};
