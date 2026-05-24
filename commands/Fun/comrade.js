const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comrade')
        .setDescription('Apply a comrade/communist overlay to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The comrade')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const comradeUrl = `https://some-random-api.com/canvas/overlay/comrade?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0xFF0000) // Red
            .setTitle('Hello Comrade!')
            .setImage(comradeUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
