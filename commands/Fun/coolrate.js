const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coolrate')
        .setDescription('Calculates how cool a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0x3498DB) // Blue
            .setTitle('😎 Cool Rater')
            .setDescription(`${target} is **${rate}%** cool!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
