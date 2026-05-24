const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('podiumimage')
        .setDescription('Put a user on a podium.')
        .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Put a user on a podium.')
            .setDescription(`You selected ${target.username}!\n\nThis command was automatically ported from the corwindev bot!`);
        await interaction.reply({ embeds: [embed] });
    },
};
