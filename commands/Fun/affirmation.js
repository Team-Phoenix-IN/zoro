const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('affirmation')
        .setDescription('Receive a positive daily affirmation.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://www.affirmations.dev/', {
                headers: { 'Accept': 'application/json' }
            });
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xFFB6C1) // Light Pink
                .setTitle('✨ Daily Affirmation')
                .setDescription(`*${data.affirmation}*`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Affirmation API Error:', error);
            await interaction.editReply({ content: 'Could not fetch an affirmation right now. Just remember, you are awesome! 🌟' });
        }
    }
};
