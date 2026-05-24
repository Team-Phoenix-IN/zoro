const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const opinions = [
    "Pineapple belongs on pizza.",
    "Cereal is better without milk.",
    "Water isn't wet.",
    "Hot dogs are technically sandwiches.",
    "The prequels are the best Star Wars movies.",
    "Sleeping with socks on is incredibly comfortable.",
    "Ketchup belongs in the fridge.",
    "Die Hard is definitively a Christmas movie.",
    "Math is the best subject in school.",
    "Winter is way better than summer."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unpopularopinion')
        .setDescription('Delivers a harmless but debatable unpopular opinion.'),
    async execute(interaction) {
        const opinion = opinions[Math.floor(Math.random() * opinions.length)];

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle('🔥 Unpopular Opinion')
            .setDescription(`**${opinion}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
