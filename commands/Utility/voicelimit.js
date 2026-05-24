const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voicelimit')
        .setDescription('Limit users in your voice channel.')
        .addNumberOption(option => option.setName('amount').setDescription('Amount or number').setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount');
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Limit users in your voice channel.')
            .setDescription(`Amount specified: **${amount}**\n\nThis command was automatically ported from the corwindev bot!`);
        await interaction.reply({ embeds: [embed] });
    },
};
