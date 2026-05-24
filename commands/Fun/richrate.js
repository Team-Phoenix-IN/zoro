const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('richrate')
        .setDescription('Calculates how rich a user will be.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const rate = Math.floor(Math.random() * 101); // 0-100

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F) // Gold
            .setTitle('💸 Rich Rater')
            .setDescription(`${target} is **${rate}%** rich!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
