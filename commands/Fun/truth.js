const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const truths = [
    "What is your biggest fear?",
    "What is the most embarrassing thing you've ever done?",
    "Have you ever lied to get out of trouble?",
    "What is a secret you've never told anyone?",
    "Who is your secret crush?",
    "What's the worst trouble you've ever been in?",
    "If you could be invisible for a day, what would you do?",
    "What is the most childish thing you still do?",
    "Have you ever accidentally sent a text to the wrong person?",
    "What's the weirdest dream you've ever had?"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truth')
        .setDescription('Generates a random Truth question.'),
    async execute(interaction) {
        const truth = truths[Math.floor(Math.random() * truths.length)];

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('😇 Truth')
            .setDescription(`**${truth}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
