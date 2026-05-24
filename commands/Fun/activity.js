const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const activities = [
    "Learn how to juggle.",
    "Start reading a new book.",
    "Do 50 pushups.",
    "Organize your computer desktop.",
    "Call a friend you haven't spoken to in a while.",
    "Drink a large glass of water.",
    "Go for a 15-minute walk outside.",
    "Learn how to say 'Hello' in 5 different languages.",
    "Write a short story about a time-traveling potato.",
    "Clean your room.",
    "Try to touch your toes.",
    "Watch a documentary about space.",
    "Bake some cookies.",
    "Meditate for 10 minutes."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Are you bored? Let the bot give you something fun to do!'),
    async execute(interaction) {
        const activity = activities[Math.floor(Math.random() * activities.length)];

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('🎯 Activity Generator')
            .setDescription(`**You should:**\n${activity}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
