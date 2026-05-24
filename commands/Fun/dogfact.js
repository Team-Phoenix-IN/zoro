const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dogfact')
        .setDescription('Get an interesting fact about dogs.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animal/dog');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x99AAB5)
                .setTitle('🐶 Dog Fact')
                .setDescription(data.fact)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Dog Fact API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a dog fact right now.' });
        }
    }
};
