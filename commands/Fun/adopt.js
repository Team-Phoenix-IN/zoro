const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adopt')
        .setDescription('Adopt a user into your family.')
        .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Adopt a user into your family.')
            .setDescription(`You selected ${target.username}!\n\nThis command was automatically ported from the corwindev bot!`);
        await interaction.reply({ embeds: [embed] });
    },
};
