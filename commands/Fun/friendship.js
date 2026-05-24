const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('friendship')
        .setDescription('Calculates the friendship compatibility between you and another user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to check friendship with')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F) // Yellow
            .setTitle('🤝 Friendship Calculator')
            .setDescription(`${interaction.user} and ${target} have a **${rate}%** friendship compatibility!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
