const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('foxfact')
        .setDescription('Get an interesting fact about foxes.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/fox');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xE67E22) // Orange
                .setTitle('🦊 Fox Fact')
                .setDescription(data.fact)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Fox Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a fox fact right now.' });
        }
    }
};
