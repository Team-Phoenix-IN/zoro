const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('luckrate')
        .setDescription('Calculates how lucky a user is today.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71) // Green
            .setTitle('🍀 Luck Rater')
            .setDescription(`${target} is **${rate}%** lucky today!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
