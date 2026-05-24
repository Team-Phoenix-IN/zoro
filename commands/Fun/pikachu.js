const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pikachu')
        .setDescription('Get a random, adorable GIF of Pikachu!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animu/pikachu');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xF1C40F) // Yellow
                .setTitle('Pika Pika! ⚡')
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Pikachu API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a Pikachu right now.' });
        }
    }
};
