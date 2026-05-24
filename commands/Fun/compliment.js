const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const compliments = [
    "You have a great sense of humor!",
    "You are an incredible friend.",
    "You light up the room.",
    "You're someone's reason to smile.",
    "You have an impeccable taste in music.",
    "You are more fun than a ball pit filled with candy.",
    "You are doing a great job, and it shows.",
    "You're a true gift to the people in your life.",
    "You are an awesome person.",
    "You're stronger than you think.",
    "You bring out the best in other people.",
    "You have the best ideas.",
    "You are always so helpful.",
    "You are one of a kind!",
    "Your creative potential seems limitless."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compliment')
        .setDescription('Send a wholesome compliment to another user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to compliment')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        const embed = new EmbedBuilder()
            .setColor(0xFF69B4) // Hot Pink
            .setDescription(`💖 Hey <@${target.id}>, ${compliment}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
