const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sepia')
        .setDescription('Apply a vintage sepia filter to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to apply the filter to')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const sepiaUrl = `https://some-random-api.com/canvas/filter/sepia?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0x704214) // Sepia Brown
            .setTitle('Sepia Filter')
            .setImage(sepiaUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
