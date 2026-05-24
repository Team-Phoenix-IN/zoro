const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Get a random picture of a cute cat!'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            const data = response.data[0];

            const embed = new EmbedBuilder()
                .setColor(0xFFA500) // Orange
                .setTitle('🐱 Meow!')
                .setImage(data.url)
                .setFooter({ text: 'Powered by The Cat API' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Cat API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a cat image right now.' });
        }
    }
};
