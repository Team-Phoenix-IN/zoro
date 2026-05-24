const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automoddisplay')
        .setDescription('View current automod settings.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('View current automod settings.')
            .setDescription('This command was automatically ported from the corwindev bot!');
        await interaction.reply({ embeds: [embed] });
    },
};
