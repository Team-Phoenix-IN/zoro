const { ChannelType, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');

// Function to update or create stats channels
async function updateStatsChannels(guild) {
    try {
        const config = await GuildConfig.findOne({ guildId: guild.id });
        if (!config || !config.statsEnabled) return;

        // Fetch members to get accurate bot count vs human count
        await guild.members.fetch();
        const totalMembers = guild.memberCount;
        const totalBots = guild.members.cache.filter(m => m.user.bot).size;

        let category = config.statsCategoryId ? guild.channels.cache.get(config.statsCategoryId) : null;
        
        // Ensure category exists
        if (!category) {
            category = await guild.channels.create({
                name: '📊 Server Stats',
                type: ChannelType.GuildCategory,
                position: 0
            });
            config.statsCategoryId = category.id;
        }

        // Helper to update or create a voice channel
        const updateOrCreate = async (channelId, name) => {
            let channel = channelId ? guild.channels.cache.get(channelId) : null;
            if (channel) {
                if (channel.name !== name) await channel.setName(name);
                return channel.id;
            } else {
                const newChannel = await guild.channels.create({
                    name,
                    type: ChannelType.GuildVoice,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionFlagsBits.Connect] // Lock channel
                        }
                    ]
                });
                return newChannel.id;
            }
        };

        config.statsMemberChannelId = await updateOrCreate(config.statsMemberChannelId, `👥 Members: ${totalMembers}`);
        config.statsBotChannelId = await updateOrCreate(config.statsBotChannelId, `🤖 Bots: ${totalBots}`);

        await config.save();
    } catch (err) {
        console.error('Error updating stats channels:', err);
    }
}

module.exports = Object.assign(
    (client) => {
        // We bind to both Add and Remove to keep it updated live
        client.on('guildMemberAdd', (member) => updateStatsChannels(member.guild));
        client.on('guildMemberRemove', (member) => updateStatsChannels(member.guild));
    },
    { updateStatsChannels }
);
