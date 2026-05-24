const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whale')
        .setDescription('Get a random picture of a whale!'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://some-random-api.com/animal/whale');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x00BFFF) // Deep Sky Blue
                .setTitle('🐋 Whale!')
                .setImage(data.image)
                .setFooter({ text: `Fact: ${data.fact}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Whale API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a whale image right now.' });
        }
    }
};
