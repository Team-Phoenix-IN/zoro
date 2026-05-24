const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hatecalc')
        .setDescription('Calculates the hate compatibility between you and another user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to check hate compatibility with')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0x8B0000) // Dark Red
            .setTitle('😡 Hate Calculator')
            .setDescription(`${interaction.user} and ${target} have a **${rate}%** hate compatibility!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
