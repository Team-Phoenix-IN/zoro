const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('triggered')
        .setDescription('Apply a TRIGGERED overlay to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user who is triggered')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        // Pass the avatar URL directly to the canvas API
        const triggeredUrl = `https://some-random-api.com/canvas/overlay/triggered?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0xFF0000) // Red
            .setTitle('TRIGGERED')
            .setImage(triggeredUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
