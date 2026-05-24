const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('Get the link to the bot dashboard to customise your server settings.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setAuthor({
                name: 'Zoro V3 Dashboard',
                iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
            })
            .setTitle('🎛️ Server Dashboard')
            .setDescription(
                `Open the dashboard to customise **${interaction.guild.name}** to your preferences.\n\n` +
                `**You can manage:**\n` +
                `> 🛡️ Auto Moderation settings\n` +
                `> 📋 Log channel configuration\n` +
                `> ✅ Verification system\n` +
                `> 🔢 Counting channel\n\n` +
                `*Login with your Discord account to access your server settings.*`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || interaction.client.user.displayAvatarURL())
            .setFooter({ text: 'Team Phoenix • Zoro V3', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Open Dashboard')
                .setStyle(ButtonStyle.Link)
                .setURL(dashboardUrl)
                .setEmoji('🚀'),
            new ButtonBuilder()
                .setLabel('Login with Discord')
                .setStyle(ButtonStyle.Link)
                .setURL(`${dashboardUrl}/auth/discord`)
                .setEmoji('🔐')
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: 64 // ephemeral
        });
    },
};
