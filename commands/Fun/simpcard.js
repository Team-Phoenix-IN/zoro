const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('simpcard')
        .setDescription('Generate an official Simp Card for a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to issue the card to')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true });
        
        const simpUrl = `https://some-random-api.com/canvas/misc/simpcard?avatar=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor(0xFF1493) // Deep Pink
            .setTitle('Official Simp Card')
            .setImage(simpUrl)
            .setFooter({ text: `Issued to: ${target.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
