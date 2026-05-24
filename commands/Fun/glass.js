const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('glass')
        .setDescription('Apply a shattered glass overlay to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to shatter')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const glassUrl = `https://some-random-api.com/canvas/overlay/glass?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0xA9DFBF) // Light Green
            .setTitle('Shattered Glass')
            .setImage(glassUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
