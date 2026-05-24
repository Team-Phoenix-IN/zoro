const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mynotes')
        .setDescription('View your personal notes.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('View your personal notes.')
            .setDescription('This command was automatically ported from the corwindev bot!');
        await interaction.reply({ embeds: [embed] });
    },
};
