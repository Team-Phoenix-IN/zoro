const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('catfact')
        .setDescription('Get an interesting fact about cats.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/cat');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xE91E63) // Pink
                .setTitle('🐱 Cat Fact')
                .setDescription(data.fact)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Cat Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a cat fact right now.' });
        }
    }
};
