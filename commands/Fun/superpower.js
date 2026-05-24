const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const powers = [
    { power: "You can fly", sideEffect: "But you can only fly 2 inches off the ground." },
    { power: "You can become invisible", sideEffect: "But only when nobody is looking at you." },
    { power: "You have super strength", sideEffect: "But your bones are made of glass." },
    { power: "You can read minds", sideEffect: "But you can only read the minds of squirrels." },
    { power: "You can teleport anywhere", sideEffect: "But you always teleport fully naked." },
    { power: "You can travel through time", sideEffect: "But you age 10 years every time you do it." },
    { power: "You can shoot lasers from your eyes", sideEffect: "But they are completely harmless laser pointers." },
    { power: "You never have to sleep", sideEffect: "But you are constantly yawning." },
    { power: "You can talk to animals", sideEffect: "But they only insult you." },
    { power: "You have extreme super speed", sideEffect: "But you trip on absolutely everything." }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('superpower')
        .setDescription('Grants you a random superpower, but ruins it with a terrible side effect!'),
    async execute(interaction) {
        const p = powers[Math.floor(Math.random() * powers.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C) // Red
            .setTitle('🦸 Superpower Generator')
            .addFields(
                { name: 'Your Superpower', value: `🟢 ${p.power}` },
                { name: 'The Side Effect', value: `🔴 ${p.sideEffect}` }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
