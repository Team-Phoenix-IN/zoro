const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crash')
        .setDescription('Play crash and win coins.')
        .addNumberOption(option => option.setName('amount').setDescription('Amount or number').setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount');
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Play crash and win coins.')
            .setDescription(`Amount specified: **${amount}**\n\nThis command was automatically ported from the corwindev bot!`);
        await interaction.reply({ embeds: [embed] });
    },
};
