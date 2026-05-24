const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lovecalc')
        .setDescription('Calculates the love compatibility between you and another user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to check compatibility with')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0xFF69B4) // Hot Pink
            .setTitle('💖 Love Calculator')
            .setDescription(`${interaction.user} and ${target} have a **${rate}%** love compatibility!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
