const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stankrate')
        .setDescription('Calculate how stanky a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to check')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
            .setColor(0x2E86C1) // Dark Blue
            .setTitle('Stank Meter')
            .setDescription(`${target} is **${rate}%** stanky! 🤢`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
