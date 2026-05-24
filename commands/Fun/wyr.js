const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const wyrs = [
    "Would you rather always be 10 minutes late or always be 20 minutes early?",
    "Would you rather lose the ability to read or lose the ability to speak?",
    "Would you rather be covered in fur or covered in scales?",
    "Would you rather have a flying carpet or a car that can drive underwater?",
    "Would you rather only be able to whisper or only be able to shout?",
    "Would you rather be able to teleport anywhere or be able to read minds?",
    "Would you rather fight one horse-sized duck or a hundred duck-sized horses?",
    "Would you rather never eat pizza again or never eat burgers again?"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wyr')
        .setDescription('Generates a "Would You Rather" scenario.'),
    async execute(interaction) {
        const prompt = wyrs[Math.floor(Math.random() * wyrs.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle('⚖️ Would You Rather')
            .setDescription(`**${prompt}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
