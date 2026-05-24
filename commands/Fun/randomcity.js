const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const cities = [
    "New York", "London", "Paris", "Tokyo", "Dubai", "Singapore", 
    "Barcelona", "Los Angeles", "Rome", "Sydney", "Toronto", "Berlin", 
    "Amsterdam", "Seoul", "Hong Kong", "Istanbul", "Mumbai", "Mexico City"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcity')
        .setDescription('Picks a random famous global city.'),
    async execute(interaction) {
        const city = cities[Math.floor(Math.random() * cities.length)];

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('🏙️ Random City')
            .setDescription(`**${city}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
