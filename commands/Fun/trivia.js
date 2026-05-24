const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const trivia = [
    { q: "What is the capital of France?", a: "Paris" },
    { q: "Which planet is known as the Red Planet?", a: "Mars" },
    { q: "Who wrote 'Hamlet'?", a: "William Shakespeare" },
    { q: "What is the largest ocean on Earth?", a: "Pacific Ocean" },
    { q: "What is the hardest natural substance on Earth?", a: "Diamond" },
    { q: "What is the chemical symbol for gold?", a: "Au" },
    { q: "In what year did the Titanic sink?", a: "1912" },
    { q: "What is the smallest country in the world?", a: "Vatican City" },
    { q: "How many bones are in the adult human body?", a: "206" },
    { q: "What is the longest river in the world?", a: "Nile River" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Get a random trivia question.'),
    async execute(interaction) {
        const item = trivia[Math.floor(Math.random() * trivia.length)];

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🧠 Trivia Time!')
            .setDescription(`**Question:** ${item.q}\n\n**Answer:** ||${item.a}||`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
