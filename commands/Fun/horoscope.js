const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const horoscopes = [
    "Aries: Today is a good day to avoid making eye contact with anyone.",
    "Taurus: The stars align to bring you exactly one piece of good news, followed by a minor inconvenience.",
    "Gemini: Your indecisiveness will reach new heights today when trying to pick what to watch on Netflix.",
    "Cancer: Someone will say something nice to you today. You will overthink it for the next 3 weeks.",
    "Leo: You will look in the mirror and realize you are, in fact, still fabulous.",
    "Virgo: A completely useless piece of trivia you learned years ago will finally become relevant today.",
    "Libra: Your quest for balance will be interrupted by a strong desire to eat an entire pizza.",
    "Scorpio: Keep your secrets close today. Specifically, the secret about how much time you spent on your phone.",
    "Sagittarius: Your adventurous spirit will lead you to try a new route home. You will get lost.",
    "Capricorn: Hard work pays off! Too bad you'll probably spend today procrastinating instead.",
    "Aquarius: Your unique ideas will confuse everyone around you, as usual.",
    "Pisces: You will experience a deep, emotional connection with a stray cat you see on the street."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('horoscope')
        .setDescription('Generates a vague, funny horoscope reading for the day.'),
    async execute(interaction) {
        const horoscope = horoscopes[Math.floor(Math.random() * horoscopes.length)];

        const embed = new EmbedBuilder()
            .setColor(0x8E44AD)
            .setTitle('🔮 Daily Horoscope')
            .setDescription(`*${horoscope}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
