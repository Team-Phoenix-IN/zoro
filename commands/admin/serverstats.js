const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');
const { updateStatsChannels } = require('../../events/guilds/serverStatsHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Enable or disable live server stats (Voice Channels).')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Enable or disable server stats')
                .setRequired(true)
                .addChoices(
                    { name: 'Enable', value: 'enable' },
                    { name: 'Disable', value: 'disable' }
                )
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const action = interaction.options.getString('action');
        let config = await GuildConfig.findOne({ guildId: interaction.guildId });
        
        if (!config) {
            config = new GuildConfig({ guildId: interaction.guildId });
        }

        if (action === 'enable') {
            if (config.statsEnabled) {
                return interaction.editReply('❌ | Server Stats are already enabled!');
            }
            config.statsEnabled = true;
            await config.save();
            await updateStatsChannels(interaction.guild);
            return interaction.editReply('✅ | Server Stats enabled! The voice channels have been created.');
        } else {
            if (!config.statsEnabled) {
                return interaction.editReply('❌ | Server Stats are already disabled!');
            }
            config.statsEnabled = false;

            // Try to delete existing channels
            try {
                if (config.statsMemberChannelId) {
                    const ch = interaction.guild.channels.cache.get(config.statsMemberChannelId);
                    if (ch) await ch.delete();
                }
                if (config.statsBotChannelId) {
                    const ch = interaction.guild.channels.cache.get(config.statsBotChannelId);
                    if (ch) await ch.delete();
                }
                if (config.statsCategoryId) {
                    const cat = interaction.guild.channels.cache.get(config.statsCategoryId);
                    if (cat) await cat.delete();
                }
            } catch (err) {
                console.error('Failed to clean up stats channels:', err);
            }

            config.statsMemberChannelId = null;
            config.statsBotChannelId = null;
            config.statsCategoryId = null;
            await config.save();

            return interaction.editReply('✅ | Server Stats disabled and channels cleaned up.');
        }
    }
};
