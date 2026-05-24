const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bird')
        .setDescription('Get a random picture of a cute bird!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/bird');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x87CEEB) // Sky Blue
                .setTitle('🐦 Tweet!')
                .setImage(data.image)
                .setFooter({ text: `Fact: ${data.fact}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Bird API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a bird image right now.' });
        }
    }
};
