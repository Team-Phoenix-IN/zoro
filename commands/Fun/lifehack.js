const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const hacks = [
    "Put your phone in the microwave to charge it 500% faster! (Don't actually do this).",
    "To avoid crying while cutting onions, simply don't form an emotional bond with them.",
    "Use ketchup as toothpaste to make your breath smell like french fries.",
    "If your car makes a funny noise, just turn the radio up louder.",
    "Sleep till noon so you only have to pay for two meals a day.",
    "Use a vacuum cleaner to quickly do your hair in the morning.",
    "Tape a piece of toast to your cat's back. Drop the cat. The anti-gravity forces will generate infinite energy.",
    "If you put a slice of cheese in your DVD player, absolutely nothing good will happen.",
    "Save time doing dishes by simply eating all your meals straight out of the pot.",
    "To keep your passwords safe, just use 'password'. Hackers will think it's too obvious."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lifehack')
        .setDescription('Generates a hilariously terrible lifehack.'),
    async execute(interaction) {
        const hack = hacks[Math.floor(Math.random() * hacks.length)];

        const embed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setTitle('💡 Terrible Lifehack')
            .setDescription(`*${hack}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
