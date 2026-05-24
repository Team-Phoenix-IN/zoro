const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifurate')
        .setDescription('Randomly calculates someone\'s Waifu rating.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0xFFB6C1) // Light pink
            .setTitle('🌸 Waifu Rater')
            .setDescription(`${target} is **${rate}%** waifu material!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
