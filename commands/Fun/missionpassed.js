const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('missionpassed')
        .setDescription('Apply a GTA Mission Passed overlay to a user\'s avatar.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The successful user')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const missionUrl = `https://some-random-api.com/canvas/overlay/missionpassed?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F) // Gold/Yellow
            .setTitle('MISSION PASSED! + Respect')
            .setImage(missionUrl)
            .setFooter({ text: `Target: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
