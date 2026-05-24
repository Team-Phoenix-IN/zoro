const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const names = [
    "John Smith", "Emma Johnson", "Michael Williams", "Olivia Brown", 
    "James Jones", "Ava Garcia", "William Miller", "Sophia Davis", 
    "Benjamin Rodriguez", "Isabella Martinez", "Lucas Hernandez", "Mia Lopez"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomname')
        .setDescription('Generates a random human name.'),
    async execute(interaction) {
        const name = names[Math.floor(Math.random() * names.length)];

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('👤 Random Name')
            .setDescription(`**${name}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
