const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Search MyAnimeList for an anime.')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The name of the anime')
                .setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
            const data = response.data;

            if (!data.data || !data.data.length) {
                return interaction.editReply({ content: `No anime found for **${query}**.` });
            }

            const anime = data.data[0];

            let synopsis = anime.synopsis || 'No synopsis available.';
            if (synopsis.length > 1024) synopsis = synopsis.substring(0, 1021) + '...';

            const embed = new EmbedBuilder()
                .setColor(0x2E51A2) // MyAnimeList Blue
                .setTitle(anime.title)
                .setURL(anime.url)
                .setThumbnail(anime.images.jpg.image_url)
                .setDescription(synopsis)
                .addFields(
                    { name: 'Type', value: anime.type || 'Unknown', inline: true },
                    { name: 'Score', value: anime.score ? anime.score.toString() : 'N/A', inline: true },
                    { name: 'Episodes', value: anime.episodes ? anime.episodes.toString() : 'Ongoing', inline: true },
                    { name: 'Status', value: anime.status || 'Unknown', inline: true },
                    { name: 'Rating', value: anime.rating || 'Unknown', inline: true }
                )
                .setFooter({ text: 'Powered by Jikan API' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Anime API Error:', error);
            await interaction.editReply({ content: 'An error occurred while searching for the anime.' });
        }
    }
};
