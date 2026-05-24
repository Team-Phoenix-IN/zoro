const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ytcomment')
        .setDescription('Generate a fake YouTube comment from your account.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text you want to comment')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const user = interaction.user;
        const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        // Pass the user's data to the canvas API
        const ytUrl = `https://some-random-api.com/canvas/misc/youtube-comment?avatar=${encodeURIComponent(avatarUrl)}&username=${encodeURIComponent(user.username)}&comment=${encodeURIComponent(text)}`;

        const embed = new EmbedBuilder()
            .setColor(0xFF0000) // YouTube Red
            .setTitle('New YouTube Comment Generated!')
            .setImage(ytUrl)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
