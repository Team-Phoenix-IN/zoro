const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const quotes = [
    { q: "May the Force be with you.", a: "Star Wars, 1977" },
    { q: "I'll be back.", a: "The Terminator, 1984" },
    { q: "Here's looking at you, kid.", a: "Casablanca, 1942" },
    { q: "You're gonna need a bigger boat.", a: "Jaws, 1975" },
    { q: "To infinity and beyond!", a: "Toy Story, 1995" },
    { q: "Houston, we have a problem.", a: "Apollo 13, 1995" },
    { q: "There's no place like home.", a: "The Wizard of Oz, 1939" },
    { q: "I am your father.", a: "Star Wars: The Empire Strikes Back, 1980" },
    { q: "Life is like a box of chocolates. You never know what you're gonna get.", a: "Forrest Gump, 1994" },
    { q: "Why so serious?", a: "The Dark Knight, 2008" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moviequote')
        .setDescription('Drops a legendary, iconic movie quote.'),
    async execute(interaction) {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2C3E50)
            .setTitle('🎬 Movie Quote')
            .setDescription(`*"${quote.q}"*\n\n— **${quote.a}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
