const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chucknorris')
        .setDescription('Get a random Chuck Norris joke.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://api.chucknorris.io/jokes/random');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xE67E22) // Orange
                .setTitle('🥋 Chuck Norris')
                .setDescription(`*${data.value}*`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Chuck Norris API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a Chuck Norris joke right now. He probably broke the API.' });
        }
    }
};
