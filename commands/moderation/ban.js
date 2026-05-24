const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false)),
    async execute(interaction) {
        const targetMember = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (!targetMember) return interaction.reply({ content: 'Member not found.', ephemeral: true });
        if (targetMember.id === interaction.user.id) return interaction.reply({ content: 'You cannot ban yourself.', ephemeral: true });
        if (targetMember.id === interaction.guild.ownerId) return interaction.reply({ content: 'You cannot ban the server owner.', ephemeral: true });
        if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: 'You cannot ban a member with an equal or higher role than you.', ephemeral: true });
        if (!targetMember.bannable) return interaction.reply({ content: 'I cannot ban this member. Do I have the correct permissions?', ephemeral: true });

        try {
            await targetMember.ban({ reason });
            await interaction.reply({ content: `Successfully banned ${targetMember.user.tag}.\nReason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to ban the member.', ephemeral: true });
        }
    },
};
