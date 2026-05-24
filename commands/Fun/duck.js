const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duck')
        .setDescription('Get a random picture of a cute duck!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://random-d.uk/api/v2/random');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xF1C40F) // Yellow
                .setTitle('🦆 Quack!')
                .setImage(data.url)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Duck API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a duck right now.' });
        }
    }
};
