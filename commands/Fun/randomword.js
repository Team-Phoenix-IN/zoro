const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const words = [
    "Serendipity", "Ephemeral", "Luminescence", "Petrichor", "Mellifluous", 
    "Ethereal", "Halcyon", "Ineffable", "Sycophant", "Lethargic", 
    "Quixotic", "Soliloquy", "Paradigm", "Ubiquitous", "Enigma"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomword')
        .setDescription('Generates a cool, complex dictionary word.'),
    async execute(interaction) {
        const word = words[Math.floor(Math.random() * words.length)];

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('📖 Random Word')
            .setDescription(`**${word}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
