const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const conspiracies = [
    "Pigeons are actually government surveillance drones.",
    "The moon doesn't exist, it's just a hologram projected by NASA.",
    "Cats are aliens sent to monitor human behavior.",
    "Clouds are just cotton candy that floated too high.",
    "Wi-Fi signals are what actually causes people to yawn.",
    "Mirrors are just portals to an alternate dimension, but your reflection blocks you from entering.",
    "Octopuses are time-traveling squids from the year 3000.",
    "Oxygen is actually poisonous, it just takes 80 years to kill us.",
    "Australia is completely fabricated and all Australians are paid actors.",
    "The earth isn't flat or round, it's actually shaped like a dinosaur."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('conspiracy')
        .setDescription('Generates a completely ridiculous, fake conspiracy theory.'),
    async execute(interaction) {
        const theory = conspiracies[Math.floor(Math.random() * conspiracies.length)];

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('👽 Conspiracy Theory')
            .setDescription(`**${theory}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
