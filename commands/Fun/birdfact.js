const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birdfact')
        .setDescription('Get an interesting fact about birds.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/bird');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x3498DB) // Blue
                .setTitle('🐦 Bird Fact')
                .setDescription(data.fact)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Bird Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a bird fact right now.' });
        }
    }
};
