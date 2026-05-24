const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const cars = [
    "Toyota", "Ford", "Chevrolet", "Honda", "Nissan", "Jeep", "Subaru", 
    "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Porsche", "Ferrari", 
    "Lamborghini", "McLaren", "Tesla", "Hyundai", "Kia", "Mazda"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcar')
        .setDescription('Picks a random car brand.'),
    async execute(interaction) {
        const car = cars[Math.floor(Math.random() * cars.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle('🚗 Random Car')
            .setDescription(`**${car}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
