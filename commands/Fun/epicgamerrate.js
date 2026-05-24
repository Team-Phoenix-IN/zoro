const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('epicgamerrate')
        .setDescription('Calculate your epic gamer energy.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to check')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        // Generate a random percentage between 0 and 100
        const rate = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Epic Gamer Rate Machine')
            .setDescription(`${target} is **${rate}%** an epic gamer! 🎮`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
