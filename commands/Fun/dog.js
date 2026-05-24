const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Get a random picture of a cute dog.'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://dog.ceo/api/breeds/image/random');
            const data = response.data;

            if (data.status !== 'success') {
                return interaction.editReply({ content: 'Could not fetch a dog image right now.' });
            }

            const embed = new EmbedBuilder()
                .setColor(0x8B4513)
                .setTitle('🐶 Woof!')
                .setImage(data.message)
                .setFooter({ text: 'Powered by Dog CEO API' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Dog API Error:', error);
            await interaction.editReply({ content: 'An error occurred while fetching the dog image.' });
        }
    }
};
