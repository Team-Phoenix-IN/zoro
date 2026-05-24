const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('simprate')
        .setDescription('Calculates how much of a simp a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C) // Red
            .setTitle('💳 Simp Rater')
            .setDescription(`${target} is **${rate}%** a simp!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
