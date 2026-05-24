const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setupticketpanel')
        .setDescription('Setup the ticket panel.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Setup the ticket panel.')
            .setDescription('This command was automatically ported from the corwindev bot!');
        await interaction.reply({ embeds: [embed] });
    },
};
