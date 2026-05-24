const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const dares = [
    "I dare you to do 10 pushups right now.",
    "I dare you to send a selfie to the chat.",
    "I dare you to speak in an accent for the next 5 minutes.",
    "I dare you to change your Discord status to something embarrassing.",
    "I dare you to let someone else send a text from your phone.",
    "I dare you to try and lick your elbow.",
    "I dare you to bark like a dog.",
    "I dare you to wear your socks on your hands for the next 10 minutes.",
    "I dare you to tell a really bad joke.",
    "I dare you to confess something embarrassing."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dare')
        .setDescription('Generates a random Dare.'),
    async execute(interaction) {
        const dare = dares[Math.floor(Math.random() * dares.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setTitle('😈 Dare')
            .setDescription(`**${dare}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
