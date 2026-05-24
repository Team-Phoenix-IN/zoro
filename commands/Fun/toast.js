const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const toasts = [
    "You are so cool, even ice cubes are jealous of you.",
    "If perfection had a name, it would be yours.",
    "You are the absolute main character of the universe.",
    "You are so smart, Einstein would ask you for help.",
    "Your presence alone increases the quality of this chat by 500%.",
    "You could probably cure all diseases just by smiling.",
    "You're not a snack, you're the entire 5-star buffet.",
    "You're so gorgeous, mirrors ask you for your autograph."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toast')
        .setDescription('The opposite of a roast! Delivers a highly exaggerated compliment to a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to toast')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const toast = toasts[Math.floor(Math.random() * toasts.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71) // Green
            .setDescription(`🥂 A toast to <@${target.id}>!\n\n**${toast}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
