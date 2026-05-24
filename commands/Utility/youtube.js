const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Search YouTube.')
        .addStringOption(option => option.setName('query').setDescription('Your input').setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`YouTube Search: ${query}`)
            .setDescription(`Here is your search result link:\n[Click here to view results on YouTube](${searchUrl})`)
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo_2005.webp');

        await interaction.reply({ embeds: [embed] });
    },
};
