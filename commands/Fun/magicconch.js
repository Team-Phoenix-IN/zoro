const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const answers = [
    "Maybe someday.",
    "Nothing.",
    "Neither.",
    "I don't think so.",
    "No.",
    "Yes.",
    "Try asking again."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('magicconch')
        .setDescription('Ask the Magic Conch Shell a question.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question you want to ask')
                .setRequired(true)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const answer = answers[Math.floor(Math.random() * answers.length)];

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6) // Purple
            .setTitle('🐚 The Magic Conch Shell')
            .addFields(
                { name: 'You Asked:', value: question },
                { name: 'The Conch Says:', value: answer }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
