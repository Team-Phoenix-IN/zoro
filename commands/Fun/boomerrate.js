const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boomerrate')
        .setDescription('Calculates how much of a boomer a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0x7F8C8D) // Grey
            .setTitle('👴 Boomer Rater')
            .setDescription(`${target} is **${rate}%** a boomer!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
