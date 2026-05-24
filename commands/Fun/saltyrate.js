const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saltyrate')
        .setDescription('Calculates how salty a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0xBDC3C7) // Silver
            .setTitle('🧂 Salty Rater')
            .setDescription(`${target} is **${rate}%** salty!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
