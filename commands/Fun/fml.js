const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const stories = [
    "Today, I walked into a glass door in front of my crush. FML.",
    "Today, I accidentally sent a meme complaining about my boss... to my boss. FML.",
    "Today, I dropped my brand new phone in the toilet before putting a case on it. FML.",
    "Today, my dog ate my pizza while I went to get a napkin. FML.",
    "Today, I waved enthusiastically at someone who was waving at the person behind me. FML.",
    "Today, I put salt in my coffee instead of sugar and took a massive gulp. FML.",
    "Today, my car broke down on the way to a job interview for a mechanic position. FML.",
    "Today, I sneezed while applying mascara. FML."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fml')
        .setDescription('Reads a funny, tragic "FML" (F*** My Life) short story.'),
    async execute(interaction) {
        const story = stories[Math.floor(Math.random() * stories.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setTitle('🤦 FML Story')
            .setDescription(`*${story}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
