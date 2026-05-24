const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const foods = [
    "Pizza", "Burger", "Sushi", "Tacos", "Pasta", "Steak", "Fried Chicken", 
    "Ramen", "Burrito", "Hot Dog", "Pancakes", "Waffles", "Ice Cream",
    "Donut", "Salad", "Sandwich", "Curry"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomfood')
        .setDescription('Picks a random food.'),
    async execute(interaction) {
        const food = foods[Math.floor(Math.random() * foods.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setTitle('🍔 Random Food')
            .setDescription(`**${food}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
