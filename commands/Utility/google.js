const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('google')
        .setDescription('Search Google.')
        .addStringOption(option => option.setName('query').setDescription('Your input').setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

        const embed = new EmbedBuilder()
            .setColor('#4285F4')
            .setTitle(`Google Search: ${query}`)
            .setDescription(`Here is your search result link:\n[Click here to view results on Google](${searchUrl})`)
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png');

        await interaction.reply({ embeds: [embed] });
    },
};
