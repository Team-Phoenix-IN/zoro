const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Time out a member for a specified duration.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to time out')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration of the timeout in minutes')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false)),
    async execute(interaction) {
        const targetMember = interaction.options.getMember('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        if (!targetMember) return interaction.reply({ content: 'Member not found.', ephemeral: true });
        if (targetMember.id === interaction.user.id) return interaction.reply({ content: 'You cannot time yourself out.', ephemeral: true });
        if (targetMember.id === interaction.guild.ownerId) return interaction.reply({ content: 'You cannot time out the server owner.', ephemeral: true });
        if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: 'You cannot time out a member with an equal or higher role than you.', ephemeral: true });
        if (!targetMember.moderatable) return interaction.reply({ content: 'I cannot time out this member. Do I have the correct permissions?', ephemeral: true });

        const durationMs = duration * 60 * 1000;

        try {
            await targetMember.timeout(durationMs, reason);
            await interaction.reply({ content: `Successfully timed out ${targetMember} for ${duration} minutes.\nReason: ${reason}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to time out the member.', ephemeral: true });
        }
    },
};
