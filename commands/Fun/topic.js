const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const topics = [
    "If you could have any superpower, what would it be and why?",
    "What is your favorite movie of all time?",
    "If you could travel anywhere in the world right now, where would you go?",
    "What is the weirdest food you have ever eaten?",
    "If you won the lottery tomorrow, what is the first thing you would buy?",
    "What is a hobby you've always wanted to try but never have?",
    "Do you believe in aliens? Why or why not?",
    "What is the best piece of advice anyone has ever given you?",
    "If you could only eat one meal for the rest of your life, what would it be?",
    "What is your favorite video game?"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('topic')
        .setDescription('Generates an interesting conversation starter for dead chats.'),
    async execute(interaction) {
        const topic = topics[Math.floor(Math.random() * topics.length)];

        const embed = new EmbedBuilder()
            .setColor(0x1ABC9C)
            .setTitle('🗣️ Conversation Starter')
            .setDescription(`**${topic}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
