const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Search for the lyrics to a song.')
        .addStringOption(option => 
            option.setName('song')
                .setDescription('The name of the song')
                .setRequired(true)
        ),
    async execute(interaction) {
        const song = interaction.options.getString('song');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://some-random-api.com/others/lyrics?title=${encodeURIComponent(song)}`);
            const data = response.data;

            if (!data || !data.lyrics) {
                return interaction.editReply({ content: `No lyrics found for **${song}**.` });
            }

            let lyricsStr = data.lyrics;
            // Discord embed descriptions have a 4096 character limit
            if (lyricsStr.length > 4096) {
                lyricsStr = lyricsStr.substring(0, 4093) + '...';
            }

            const embed = new EmbedBuilder()
                .setColor(0x1DB954) // Spotify Green
                .setTitle(`${data.title} - ${data.author}`)
                .setDescription(lyricsStr)
                .setThumbnail(data.thumbnail ? data.thumbnail.genius : null)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Lyrics API Error:', error);
            await interaction.editReply({ content: `Could not find lyrics for **${song}**.` });
        }
    }
};
