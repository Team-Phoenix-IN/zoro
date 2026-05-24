const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamerrate')
        .setDescription('Calculates how much of an Epic Gamer a user is.')
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
            .setTitle('🎮 Epic Gamer Rater')
            .setDescription(`${target} is **${rate}%** an Epic Gamer!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
