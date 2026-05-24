const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pixelate')
        .setDescription('Apply a pixelation filter to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to pixelate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const pixelUrl = `https://some-random-api.com/canvas/filter/pixelate?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0x3498DB) // Blue
            .setTitle('Pixelated')
            .setImage(pixelUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
