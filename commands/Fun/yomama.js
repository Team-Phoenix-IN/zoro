const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const jokes = [
    "Yo mama so fat, when she fell I didn't laugh, but the sidewalk cracked up.",
    "Yo mama so old, she walked out of a museum and the alarm went off.",
    "Yo mama so stupid, she brought a spoon to the Super Bowl.",
    "Yo mama so ugly, she made a blind kid cry.",
    "Yo mama so fat, she stepped on a scale and it said: 'To be continued.'",
    "Yo mama so dumb, she tried to put M&M's in alphabetical order.",
    "Yo mama so fat, when she wears yellow people yell 'Taxi!'",
    "Yo mama so stupid, she stared at a cup of orange juice for 12 hours because it said 'Concentrate'.",
    "Yo mama so old, she knew Burger King when he was just a prince.",
    "Yo mama so poor, ducks throw bread at her.",
    "Yo mama so fat, she woke up on both sides of the bed.",
    "Yo mama so ugly, her portraits hang themselves.",
    "Yo mama so short, she has to slam dunk her bus fare.",
    "Yo mama so stupid, she returned a donut because it had a hole in it.",
    "Yo mama so fat, even Dora couldn't explore her."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yomama')
        .setDescription('Deliver a classic, harmless Yo Mama joke.'),
    async execute(interaction) {
        const joke = jokes[Math.floor(Math.random() * jokes.length)];

        const embed = new EmbedBuilder()
            .setColor(0xF39C12) // Orange
            .setTitle('Yo Mama...')
            .setDescription(`**${joke}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
