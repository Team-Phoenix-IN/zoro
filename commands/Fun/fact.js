const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const facts = [
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "A day on Venus is longer than a year on Venus.",
    "Bananas are officially classified as berries, but strawberries are not.",
    "Wombat poop is cube-shaped so it doesn't roll away.",
    "Octopuses have three hearts and blue blood.",
    "There are more stars in the universe than grains of sand on all the beaches on Earth.",
    "Water can boil and freeze at the exact same time. It's called the 'triple point'.",
    "A jiffy is an actual unit of time. It's 1/100th of a second.",
    "Cows have best friends and get stressed when they are separated.",
    "The inventor of the frisbee was turned into a frisbee after he died."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Delivers a mind-blowing offline fact.'),
    async execute(interaction) {
        const fact = facts[Math.floor(Math.random() * facts.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('🤯 Did You Know?')
            .setDescription(`*${fact}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
