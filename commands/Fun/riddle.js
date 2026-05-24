const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const riddles = [
    { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo" },
    { q: "You measure my life in hours and I serve you by expiring. I'm quick when I'm thin and slow when I'm fat. The wind is my enemy. What am I?", a: "A candle" },
    { q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", a: "A map" },
    { q: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?", a: "The letter 'R'" },
    { q: "You see a boat filled with people. It has not sunk, but when you look again you don't see a single person on the boat. Why?", a: "All the people were married" },
    { q: "What word in the English language does the following: the first two letters signify a male, the first three letters signify a female, the first four letters signify a great, while the entire world signifies a great woman. What is the word?", a: "Heroine" },
    { q: "What disappears as soon as you say its name?", a: "Silence" },
    { q: "I have keys, but no locks. I have space, but no room. You can enter, but you can't go outside. What am I?", a: "A keyboard" },
    { q: "What is so fragile that saying its name breaks it?", a: "Silence" },
    { q: "What gets wetter the more it dries?", a: "A towel" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('riddle')
        .setDescription('Get a tricky riddle to solve with your friends.'),
    async execute(interaction) {
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6) // Purple
            .setTitle('🤔 Riddle Me This')
            .setDescription(`**${riddle.q}**\n\n**Answer:** ||${riddle.a}||`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
