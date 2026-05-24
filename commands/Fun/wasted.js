const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wasted')
        .setDescription('Apply a GTA Wasted overlay to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to waste')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        // Pass the avatar URL directly to the canvas API
        const wastedUrl = `https://some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0x000000) // Black
            .setTitle('WASTED')
            .setImage(wastedUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
