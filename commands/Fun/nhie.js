const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const nhies = [
    "Never have I ever pretended to be sick to skip school/work.",
    "Never have I ever fallen asleep in public.",
    "Never have I ever accidentally dropped my phone on my face.",
    "Never have I ever eaten food off the floor.",
    "Never have I ever snooped through someone else's phone.",
    "Never have I ever laughed so hard I cried.",
    "Never have I ever walked into a glass door.",
    "Never have I ever forgotten someone's name immediately after meeting them."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nhie')
        .setDescription('Generates a "Never Have I Ever" prompt.'),
    async execute(interaction) {
        const prompt = nhies[Math.floor(Math.random() * nhies.length)];

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('🖐️ Never Have I Ever')
            .setDescription(`**${prompt}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
