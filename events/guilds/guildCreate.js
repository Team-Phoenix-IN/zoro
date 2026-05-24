const { Events } = require('discord.js');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(guild) {
        try {
            // When the bot joins a new server, fetch or create its config
            await getGuildConfig(guild.id);
            console.log(`Joined new guild: ${guild.name} (${guild.id}). Config verified.`);
        } catch (error) {
            console.error(`Error creating config for new guild ${guild.id}:`, error);
        }
    },
};
