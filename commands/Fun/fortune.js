const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fortunes = [
    "A beautiful, smart, and loving person will be coming into your life.",
    "A fresh start will put you on your way.",
    "A golden egg of opportunity falls into your lap this month.",
    "A lifetime of happiness lies ahead of you.",
    "All the effort you are making will ultimately pay off.",
    "Any decision you have to make tomorrow is a good decision.",
    "Believe in yourself and others will too.",
    "Don't just spend time. Invest it.",
    "Every exit is an entrance to new experiences.",
    "Good news will come to you by mail.",
    "Hard work pays off in the future, laziness pays off now.",
    "If you continually give, you will continually have.",
    "Let the deeds speak.",
    "The man on the top of the mountain did not fall there.",
    "You will conquer obstacles to achieve success."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortune')
        .setDescription('Crack open a fortune cookie!'),
    async execute(interaction) {
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F) // Gold
            .setTitle('🥠 Fortune Cookie')
            .setDescription(`*${fortune}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
