const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panda')
        .setDescription('Get a random picture of an adorable panda!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/panda');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF) // White
                .setTitle('🐼 Panda!')
                .setImage(data.image)
                .setFooter({ text: `Fact: ${data.fact}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Panda API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a panda image right now.' });
        }
    }
};
