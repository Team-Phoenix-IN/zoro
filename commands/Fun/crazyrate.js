const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crazyrate')
        .setDescription('Calculates how crazy a user is.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6) // Purple
            .setTitle('🤪 Crazy Rater')
            .setDescription(`${target} is **${rate}%** crazy!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
