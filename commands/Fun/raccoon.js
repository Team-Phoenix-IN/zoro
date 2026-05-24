const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raccoon')
        .setDescription('Get a random picture of a raccoon!'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://some-random-api.com/animal/raccoon');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x808080) // Gray
                .setTitle('🦝 Trash Panda!')
                .setImage(data.image)
                .setFooter({ text: `Fact: ${data.fact}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Raccoon API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a raccoon image right now.' });
        }
    }
};
