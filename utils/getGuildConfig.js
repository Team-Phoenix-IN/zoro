const mongoose = require('mongoose');
const GuildConfig = require('../schemas/GuildConfig');

/**
 * Fetches a guild's config from the database, or creates a new one if it doesn't exist.
 * @param {string} guildId - The Discord Guild ID
 * @returns {Promise<Document>} The Mongoose document for the guild
 */
async function getGuildConfig(guildId) {
    if (!guildId) return null;

    // Guard: fail fast if not connected instead of buffering for 10s
    if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB is not connected. Cannot query guild config.');
    }
    
    let config = await GuildConfig.findOne({ guildId });
    if (!config) {
        config = await GuildConfig.create({ guildId });
    }
    
    return config;
}

module.exports = getGuildConfig;
