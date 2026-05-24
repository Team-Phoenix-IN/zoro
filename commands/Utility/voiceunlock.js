const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voiceunlock')
        .setDescription('Unlock your voice channel.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Unlock your voice channel.')
            .setDescription('This command was automatically ported from the corwindev bot!');
        await interaction.reply({ embeds: [embed] });
    },
};
