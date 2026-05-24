const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const pickupLines = [
    "Are you a magician? Because whenever I look at you, everyone else disappears!",
    "I'm not a photographer, but I can picture me and you together.",
    "Do I know you? ‘Cause you look a lot like my next partner.",
    "Are you French? Because Eiffel for you.",
    "Is your name Google? Because you have everything I’ve been searching for.",
    "If you were a vegetable, you’d be a cute-cumber.",
    "Do you have a map? I keep getting lost in your eyes.",
    "Are you a time traveler? Cause I see you in my future!",
    "Are you a bank loan? Because you got my interest.",
    "Do you believe in love at first sight—or should I walk by again?",
    "If I could rearrange the alphabet, I’d put ‘U’ and ‘I’ together.",
    "Feel my shirt. Know what it’s made of? Boyfriend material.",
    "Are you a parking ticket? Because you’ve got FINE written all over you.",
    "Well, here I am. What are your other two wishes?",
    "Are you made of copper and tellurium? Because you’re CuTe."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pickupline')
        .setDescription('Drop a hilariously cheesy pickup line on someone.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to swoon')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const line = pickupLines[Math.floor(Math.random() * pickupLines.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C) // Red
            .setDescription(`Hey <@${target.id}>...\n\n**${line}** 😏`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
