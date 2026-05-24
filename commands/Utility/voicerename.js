const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voicerename')
        .setDescription('Rename your voice channel.')
        .addStringOption(option => option.setName('query').setDescription('Your input').setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Rename your voice channel.')
            .setDescription(`Your input: **${query}**\n\nThis command was automatically ported from the corwindev bot!`);
        await interaction.reply({ embeds: [embed] });
    },
};
