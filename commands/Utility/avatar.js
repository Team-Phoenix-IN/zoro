const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar of a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user\'s avatar to show')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = user.displayAvatarURL({ size: 1024, dynamic: true });

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatarUrl)
            .setURL(avatarUrl);

        await interaction.reply({ embeds: [embed] });
    }
};
