const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Sets the moderation log channel for this server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send moderation logs to')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        await interaction.deferReply({ ephemeral: true });

        try {
            const config = await getGuildConfig(interaction.guildId);
            config.logChannelId = channel.id;
            await config.save();

            await interaction.editReply(`Successfully set the log channel to ${channel}.`);
        } catch (error) {
            console.error('Error setting log channel:', error);
            await interaction.editReply('There was an error updating the log channel in the database.');
        }
    },
};
