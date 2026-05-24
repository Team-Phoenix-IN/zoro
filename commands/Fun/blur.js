const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blur')
        .setDescription('Apply a blur filter to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to blur')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const blurUrl = `https://some-random-api.com/canvas/filter/blur?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0x34495E) // Dark slate
            .setTitle('Blurred')
            .setImage(blurUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
