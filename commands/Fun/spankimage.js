const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spankimage')
        .setDescription('Spank another user.')
        .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Spank another user.')
            .setDescription(`You selected ${target.username}!\n\nThis command was automatically ported from the corwindev bot!`);
        await interaction.reply({ embeds: [embed] });
    },
};
