const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tweet')
        .setDescription('Generate a fake tweet from your account.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text you want to tweet')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const user = interaction.user;
        const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        // Pass the user's data to the canvas API
        const tweetUrl = `https://some-random-api.com/canvas/misc/tweet?avatar=${encodeURIComponent(avatarUrl)}&displayname=${encodeURIComponent(user.displayName || user.username)}&username=${encodeURIComponent(user.username)}&comment=${encodeURIComponent(text)}`;

        const embed = new EmbedBuilder()
            .setColor(0x1DA1F2) // Twitter Blue
            .setTitle('New Tweet Generated!')
            .setImage(tweetUrl)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
