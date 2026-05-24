const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const jobs = [
    "Professional Sleeper", "Water Slide Tester", "Fortune Cookie Writer", 
    "Pet Food Taster", "Ostrich Babysitter", "Golf Ball Diver", 
    "Paper Towel Sniffer", "Zombie Prevention Expert", "Professional Apologizer",
    "Chief Vibe Officer"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomjob')
        .setDescription('Generates a random silly profession.'),
    async execute(interaction) {
        const job = jobs[Math.floor(Math.random() * jobs.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle('💼 Random Profession')
            .setDescription(`**${job}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
