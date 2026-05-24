const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const messages = [
    "Goodnight! Sleep tight and don't let the bedbugs bite.",
    "Wishing you the sweetest dreams tonight.",
    "Rest well and wake up refreshed!",
    "May your dreams be full of happiness.",
    "Sending you goodnight wishes! See you tomorrow.",
    "Have a peaceful night's sleep.",
    "Close your eyes and drift into dreamland.",
    "Goodnight! I hope you have a wonderful tomorrow."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodnight')
        .setDescription('Sends a wholesome goodnight message to a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to wish a goodnight')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const msg = messages[Math.floor(Math.random() * messages.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2C3E50) // Dark Blue
            .setDescription(`🌙 Hey <@${target.id}>, ${msg}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
