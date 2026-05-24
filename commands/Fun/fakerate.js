const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fakerate')
        .setDescription('Calculates how fake a user is.')
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
            .setTitle('🐍 Fake Rater')
            .setDescription(`${target} is **${rate}%** fake!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
