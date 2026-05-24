const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        const targetMember = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (!targetMember) return interaction.reply({ content: 'Member not found.', ephemeral: true });
        if (targetMember.id === interaction.user.id) return interaction.reply({ content: 'You cannot kick yourself.', ephemeral: true });
        if (targetMember.id === interaction.guild.ownerId) return interaction.reply({ content: 'You cannot kick the server owner.', ephemeral: true });
        if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: 'You cannot kick a member with an equal or higher role than you.', ephemeral: true });
        if (!targetMember.kickable) return interaction.reply({ content: 'I cannot kick this member. Do I have the correct permissions?', ephemeral: true });

        try {
            await targetMember.kick(reason);
            await interaction.reply({ content: `Successfully kicked ${targetMember.user.tag}.\nReason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to kick the member.', ephemeral: true });
        }
    },
};
