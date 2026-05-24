const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelogs')
        .setDescription('View bot changelogs.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('View bot changelogs.')
            .setDescription('This command was automatically ported from the corwindev bot!');
        await interaction.reply({ embeds: [embed] });
    },
};
