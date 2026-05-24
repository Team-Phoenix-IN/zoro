const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kanye')
        .setDescription('Get a random, wild quote from Kanye West.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://api.kanye.rest/');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x8B4513) // Brown
                .setTitle('Yeezy says...')
                .setDescription(`*"${data.quote}"*`)
                .setFooter({ text: '- Kanye West' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Kanye API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a Kanye quote right now.' });
        }
    }
};
