const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invert')
        .setDescription('Invert the colors of a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to invert')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const invertUrl = `https://some-random-api.com/canvas/filter/invert?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0x34495E) // Dark slate
            .setTitle('Inverted Colors')
            .setImage(invertUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
