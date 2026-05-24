const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('redpanda')
        .setDescription('Get a random picture of a cute red panda!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/red_panda');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xCC0000) // Dark Red
                .setTitle('🐼 Red Panda!')
                .setImage(data.image)
                .setFooter({ text: `Fact: ${data.fact}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Red Panda API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a red panda image right now.' });
        }
    }
};
