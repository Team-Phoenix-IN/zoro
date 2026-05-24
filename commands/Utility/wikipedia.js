const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wikipedia')
        .setDescription('Search Wikipedia for a topic.')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The topic to search for')
                .setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            const data = response.data;

            if (data.type === 'disambiguation') {
                return interaction.editReply({ content: `The term **${query}** is too broad. Please be more specific.` });
            }

            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle(`Wikipedia: ${data.title}`)
                .setURL(data.content_urls.desktop.page)
                .setDescription(data.extract || 'No summary available.')
                .setFooter({ text: 'Powered by Wikipedia' })
                .setTimestamp();

            if (data.thumbnail && data.thumbnail.source) {
                embed.setThumbnail(data.thumbnail.source);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await interaction.editReply({ content: `Could not find a Wikipedia page for **${query}**.` });
            } else {
                console.error('Wikipedia API Error:', error);
                await interaction.editReply({ content: 'An error occurred while searching Wikipedia.' });
            }
        }
    }
};
