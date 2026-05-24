const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const thoughts = [
    "Watermelons are just water you can eat.",
    "Your future self is watching you right now through memories.",
    "Fire trucks are actually water trucks.",
    "Teeth are the only bones you can wash.",
    "We wake up every day and act like we aren't floating in space on a giant rock.",
    "Mirrors don't break, they just multiply.",
    "The hospital you were born in is the only building you left without entering.",
    "If tomato is a fruit, then ketchup is a smoothie.",
    "You've never actually seen your own face, only pictures and reflections.",
    "Sleep is just a free trial of death.",
    "Every odd number has an 'e' in it.",
    "When you clean a vacuum cleaner, you become a vacuum cleaner.",
    "Your shadow is a confirmation that light has traveled nearly 93 million miles unimpeded, only to be deprived of hitting the ground in the final few feet thanks to you.",
    "Water is a beverage whose flavor is its temperature.",
    "The word 'swims' upside down is still 'swims'."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showerthought')
        .setDescription('Get a mind-blowing shower thought.'),
    async execute(interaction) {
        const thought = thoughts[Math.floor(Math.random() * thoughts.length)];

        const embed = new EmbedBuilder()
            .setColor(0x3498DB) // Blue
            .setTitle('🚿 Shower Thought')
            .setDescription(`*${thought}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
