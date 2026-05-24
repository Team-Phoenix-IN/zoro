const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wantedimage')
        .setDescription('Create a wanted poster.')
        .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        // Because canvas requires complex system dependencies, we use a public API wrapper for images when possible.
        // If an API like popcat isn't available, we fallback to linking the avatar.
        
        // This is a free open API endpoint for a wanted poster effect
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512 });
        const wantedUrl = `https://api.popcat.xyz/wanted?image=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`Wanted: ${target.username}`)
            .setImage(wantedUrl)
            .setFooter({ text: 'Ported from corwindev' });

        await interaction.reply({ embeds: [embed] });
    },
};
