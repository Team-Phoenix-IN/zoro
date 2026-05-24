const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('itunes')
        .setDescription('Search iTunes for a song.')
        .addStringOption(option => 
            option.setName('song')
                .setDescription('The name of the song to search')
                .setRequired(true)
        ),
    async execute(interaction) {
        const term = interaction.options.getString('song');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=1&entity=song`);
            const data = response.data;

            if (!data.results || !data.results.length) {
                return interaction.editReply({ content: `No song found matching **${term}**.` });
            }

            const track = data.results[0];

            const embed = new EmbedBuilder()
                .setColor(0xFC3C44) // Apple Music Pink/Red
                .setTitle(track.trackName)
                .setURL(track.trackViewUrl)
                .setThumbnail(track.artworkUrl100)
                .addFields(
                    { name: 'Artist', value: track.artistName, inline: true },
                    { name: 'Album', value: track.collectionName || 'Unknown', inline: true },
                    { name: 'Release Date', value: new Date(track.releaseDate).toLocaleDateString(), inline: true },
                    { name: 'Genre', value: track.primaryGenreName, inline: true }
                )
                .setFooter({ text: 'Powered by iTunes API' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('iTunes API Error:', error);
            await interaction.editReply({ content: 'An error occurred while searching iTunes.' });
        }
    }
};
