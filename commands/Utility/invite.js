const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get a link to invite the bot to your own server!'),
    async execute(interaction) {
        // Automatically generate an OAuth2 invite URL using the bot's Client ID
        const clientId = interaction.client.user.id;
        const permissions = PermissionsBitField.Flags.Administrator; // Request admin for all features, or use '8'
        
        const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71) // Green
            .setTitle(`Invite ${interaction.client.user.username}!`)
            .setDescription(`Want to add me to your server? Click the link below!\n\n🔗 [Click here to invite me](${inviteUrl})`)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
