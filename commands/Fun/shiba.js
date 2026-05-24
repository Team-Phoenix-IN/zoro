const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shiba')
        .setDescription('Get a random picture of an adorable Shiba Inu!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xE67E22) // Orange
                .setTitle('🐶 Doge!')
                .setImage(data[0])
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Shiba API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a shiba right now.' });
        }
    }
};
