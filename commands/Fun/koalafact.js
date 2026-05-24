const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('koalafact')
        .setDescription('Get an interesting fact about koalas.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/koala');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x95A5A6) // Grey
                .setTitle('🐨 Koala Fact')
                .setDescription(data.fact)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Koala Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a koala fact right now.' });
        }
    }
};
