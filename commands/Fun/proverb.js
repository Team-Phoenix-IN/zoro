const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const proverbs = [
    "A journey of a thousand miles begins with a single step.",
    "Actions speak louder than words.",
    "Don't bite the hand that feeds you.",
    "Don't judge a book by its cover.",
    "Every cloud has a silver lining.",
    "Fortune favors the bold.",
    "If it ain't broke, don't fix it.",
    "Practice makes perfect.",
    "Rome wasn't built in a day.",
    "The early bird catches the worm.",
    "Two wrongs don't make a right.",
    "When in Rome, do as the Romans do."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('proverb')
        .setDescription('Gives you a classic, wise proverb to ponder.'),
    async execute(interaction) {
        const proverb = proverbs[Math.floor(Math.random() * proverbs.length)];

        const embed = new EmbedBuilder()
            .setColor(0x34495E)
            .setTitle('📜 Words of Wisdom')
            .setDescription(`*${proverb}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
