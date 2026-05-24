const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nasa')
        .setDescription('Fetch the NASA Astronomy Picture of the Day.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
            const data = response.data;

            let explanation = data.explanation;
            if (explanation.length > 2048) {
                explanation = explanation.substring(0, 2045) + '...';
            }

            const embed = new EmbedBuilder()
                .setColor(0x0B3D91) // NASA Blue
                .setTitle(`NASA APOD: ${data.title}`)
                .setDescription(explanation)
                .setImage(data.hdurl || data.url)
                .setFooter({ text: `Date: ${data.date}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('NASA API Error:', error);
            await interaction.editReply({ content: 'Could not fetch the NASA image right now. The DEMO_KEY might be rate limited.' });
        }
    }
};
