const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rainbow')
        .setDescription('Apply a colorful rainbow overlay to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to apply the overlay to')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const rainbowUrl = `https://some-random-api.com/canvas/overlay/gay?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0xFF69B4) // Pink
            .setTitle('Rainbow Filter')
            .setImage(rainbowUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
