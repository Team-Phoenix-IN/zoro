const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const countries = [
    "United States", "Canada", "Mexico", "Brazil", "United Kingdom", "France", 
    "Germany", "Italy", "Spain", "Russia", "China", "Japan", "South Korea", 
    "India", "Australia", "South Africa", "Egypt", "Argentina", "Sweden", "Norway"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcountry')
        .setDescription('Picks a random country.'),
    async execute(interaction) {
        const country = countries[Math.floor(Math.random() * countries.length)];

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🌎 Random Country')
            .setDescription(`**${country}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
