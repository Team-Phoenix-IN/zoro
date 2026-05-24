const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verification')
        .setDescription('Setup the server verification system in a specific channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send the verification embed to')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The verified role to assign to users')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');

        const embed = new EmbedBuilder()
            .setTitle('Server Verification')
            .setDescription('Welcome to the server! Please click the button below to verify yourself and gain access to the rest of the server.')
            .setColor('Green');

        // We embed the role ID in the custom ID of the button so we know which role to assign later.
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`verify_${role.id}`)
                    .setLabel('Verify')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅')
            );

        try {
            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `Verification system successfully set up in ${channel} assigning the ${role} role!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to send the verification message to that channel. Make sure I have permissions to send messages and embeds there.', ephemeral: true });
        }
    },
};
