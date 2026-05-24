const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('songlyrics')
        .setDescription('Get lyrics for a song.')
        .addStringOption(option => option.setName('query').setDescription('Song title').setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            const res = await axios.get(`https://some-random-api.com/lyrics?title=${encodeURIComponent(query)}`);
            if (!res.data || !res.data.lyrics) {
                return interaction.editReply('❌ | Could not find lyrics for that song.');
            }

            const embed = new EmbedBuilder()
                .setTitle(`Lyrics for: ${res.data.title}`)
                .setAuthor({ name: res.data.author })
                .setDescription(res.data.lyrics.length > 4000 ? res.data.lyrics.substring(0, 4000) + '...' : res.data.lyrics)
                .setColor('Blue');

            if (res.data.thumbnail) {
                embed.setThumbnail(res.data.thumbnail.genius);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('❌ | An error occurred while fetching the lyrics.');
        }
    },
};
