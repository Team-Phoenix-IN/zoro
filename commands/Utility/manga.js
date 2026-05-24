const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Search MyAnimeList for a manga.')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The name of the manga')
                .setRequired(true)
        ),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`);
            const data = response.data;

            if (!data.data || !data.data.length) {
                return interaction.editReply({ content: `No manga found for **${query}**.` });
            }

            const manga = data.data[0];

            let synopsis = manga.synopsis || 'No synopsis available.';
            if (synopsis.length > 1024) synopsis = synopsis.substring(0, 1021) + '...';

            const embed = new EmbedBuilder()
                .setColor(0x2E51A2) // MyAnimeList Blue
                .setTitle(manga.title)
                .setURL(manga.url)
                .setThumbnail(manga.images.jpg.image_url)
                .setDescription(synopsis)
                .addFields(
                    { name: 'Type', value: manga.type || 'Unknown', inline: true },
                    { name: 'Score', value: manga.score ? manga.score.toString() : 'N/A', inline: true },
                    { name: 'Chapters', value: manga.chapters ? manga.chapters.toString() : 'Ongoing', inline: true },
                    { name: 'Status', value: manga.status || 'Unknown', inline: true }
                )
                .setFooter({ text: 'Powered by Jikan API' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Manga API Error:', error);
            await interaction.editReply({ content: 'An error occurred while searching for the manga.' });
        }
    }
};
