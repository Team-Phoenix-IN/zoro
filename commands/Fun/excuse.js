const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const excuses = [
    "I was abducted by aliens.",
    "My dog ate my homework, and then my dog exploded.",
    "I'm trapped in a time loop and this is my 5th time living this day.",
    "I accidentally joined a cult on my way here.",
    "My WiFi router was possessed by a ghost.",
    "I had to help Batman fight the Joker.",
    "A wizard cursed me with chronic lateness.",
    "I forgot how to walk for about 45 minutes.",
    "I was busy trying to find the end of the rainbow.",
    "My bed was just way too comfortable.",
    "I took a wrong turn and ended up in Narnia."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('excuse')
        .setDescription('Generates a ridiculous excuse for why you are late or can\'t do something.'),
    async execute(interaction) {
        const excuse = excuses[Math.floor(Math.random() * excuses.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle('🤷 Excuse Generator')
            .setDescription(`*${excuse}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
