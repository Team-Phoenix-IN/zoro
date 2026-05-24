const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emojis = [
    "😀", "😂", "🥰", "😎", "🤔", "🥶", "🤯", "🥳", "🤫", "🤥", 
    "🤡", "👽", "👻", "🤖", "🎃", "💩", "🦄", "🐉", "🍔", "🍕", 
    "🚗", "🚀", "⚽", "🎮", "🎸", "🔥", "✨", "💯", "💀", "👀"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomemoji')
        .setDescription('Generates a completely random emoji.'),
    async execute(interaction) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle('🎲 Random Emoji')
            .setDescription(`**${emoji}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
