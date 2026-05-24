const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-counting')
        .setDescription('Setup the counting mini-game channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel for the counting game')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(option => 
            option.setName('fail-role')
                .setDescription('Role to give to the user who ruins the count')
                .setRequired(false))
        .addIntegerOption(option => 
            option.setName('fail-timeout')
                .setDescription('Time in minutes to keep the fail role (default: 5)')
                .setRequired(false)
                .setMinValue(1)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const failRole = interaction.options.getRole('fail-role');
        const failTimeout = interaction.options.getInteger('fail-timeout') || 5;

        await interaction.deferReply({ ephemeral: true });

        try {
            const config = await getGuildConfig(interaction.guildId);
            config.countingChannelId = channel.id;
            config.currentCount = 0;
            config.lastCounterId = null;
            
            if (failRole) {
                config.countingFailRoleId = failRole.id;
                config.countingFailTimeMinutes = failTimeout;
            } else {
                config.countingFailRoleId = null;
                config.countingFailTimeMinutes = 0;
            }

            await config.save();

            let responseMsg = `✅ Successfully set ${channel} as the counting channel.`;
            if (failRole) {
                responseMsg += `\nUsers who ruin the count will receive the ${failRole} role for ${failTimeout} minutes.`;
            }

            await interaction.editReply(responseMsg);
            await channel.send('🔢 **Counting Game Started!** The count has been reset to 0. The next number is **1**.');
        } catch (error) {
            console.error('Error setting up counting channel:', error);
            await interaction.editReply('There was an error saving the configuration.');
        }
    },
};
