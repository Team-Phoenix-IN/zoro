const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('koala')
        .setDescription('Get a random picture of an adorable koala!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/koala');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x808080) // Gray
                .setTitle('🐨 Koala!')
                .setImage(data.image)
                .setFooter({ text: `Fact: ${data.fact}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Koala API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a koala image right now.' });
        }
    }
};
