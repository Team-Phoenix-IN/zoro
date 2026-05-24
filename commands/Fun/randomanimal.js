const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const animals = [
    "Lion", "Tiger", "Elephant", "Giraffe", "Penguin", "Kangaroo", 
    "Koala", "Panda", "Sloth", "Platypus", "Armadillo", "Chameleon",
    "Dolphin", "Cheetah", "Rhino", "Hippopotamus"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomanimal')
        .setDescription('Picks a random animal.'),
    async execute(interaction) {
        const animal = animals[Math.floor(Math.random() * animals.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('🐾 Random Animal')
            .setDescription(`**${animal}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
