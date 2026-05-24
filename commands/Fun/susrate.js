const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('susrate')
        .setDescription('Calculates how "sus" a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0xC0392B) // Dark Red (Among Us style)
            .setTitle('🕵️ Sus Rater')
            .setDescription(`${target} is **${rate}%** sus!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
