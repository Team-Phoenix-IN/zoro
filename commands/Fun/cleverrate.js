const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleverrate')
        .setDescription('Calculate how clever a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to check')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
            .setColor(0x3498DB) // Blue
            .setTitle('Cleverness Machine')
            .setDescription(`${target} is **${rate}%** clever! 🧠`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
