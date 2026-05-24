const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pandafact')
        .setDescription('Get an interesting fact about pandas.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/panda');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x2C3E50) // Dark Grey/Black
                .setTitle('🐼 Panda Fact')
                .setDescription(data.fact)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Panda Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a panda fact right now.' });
        }
    }
};
