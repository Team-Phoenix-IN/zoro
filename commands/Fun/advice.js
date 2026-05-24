const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('advice')
        .setDescription('Get a random piece of life advice.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://api.adviceslip.com/advice');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x2ECC71) // Green
                .setTitle('💡 Random Advice')
                .setDescription(data.slip.advice)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Advice API Error:', error);
            await interaction.editReply({ content: 'Could not fetch advice right now.' });
        }
    }
};
