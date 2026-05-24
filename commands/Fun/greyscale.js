const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greyscale')
        .setDescription('Apply a greyscale (black and white) filter to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to filter')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const greyscaleUrl = `https://some-random-api.com/canvas/filter/greyscale?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0x808080) // Grey
            .setTitle('Greyscale Filter')
            .setImage(greyscaleUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
