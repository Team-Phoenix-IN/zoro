const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const messages = [
    "Good morning! Have a fantastic day ahead.",
    "Rise and shine! The world is waiting for you.",
    "Good morning! May your cup overflow with coffee and joy today.",
    "Wishing you a bright and beautiful morning!",
    "Wake up! It's a brand new day full of opportunities.",
    "Good morning! Make today amazing.",
    "Sending you positive vibes for a great morning.",
    "Good morning! Hope your day is as awesome as you are."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodmorning')
        .setDescription('Sends an energizing good morning message to a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to wish a good morning')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const msg = messages[Math.floor(Math.random() * messages.length)];

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F) // Yellow/Sun
            .setDescription(`☀️ Hey <@${target.id}>, ${msg}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
