const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kangaroo')
        .setDescription('Get a random picture of a kangaroo!'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://some-random-api.com/animal/kangaroo');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xD2B48C) // Tan
                .setTitle('🦘 Kangaroo!')
                .setImage(data.image)
                .setFooter({ text: `Fact: ${data.fact}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Kangaroo API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a kangaroo image right now.' });
        }
    }
};
