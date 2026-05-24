const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    logChannelId: { type: String, default: null },
    automodEnabled: { type: Boolean, default: false },

    // Counting Game Data
    countingChannelId: { type: String, default: null },
    currentCount: { type: Number, default: 0 },
    lastCounterId: { type: String, default: null },
    countingFailRoleId: { type: String, default: null },
    countingFailTimeMinutes: { type: Number, default: 0 },

    // Dashboard: Prefix and disabled command names
    prefix: { type: String, default: '!' },
    disabledCommands: { type: [String], default: [] },

    // Verification panel config
    verificationChannelId: { type: String, default: null },
    verificationRoleId:    { type: String, default: null },
    // Welcome System
    welcomeChannelId: { type: String, default: null },
    welcomeMessage:   { type: String, default: 'Welcome {user} to {server}!' },
    leaveChannelId:   { type: String, default: null },
    leaveMessage:     { type: String, default: '{user} has left the server.' },

    // Leveling System
    levelingEnabled:  { type: Boolean, default: false },
    levelUpChannelId: { type: String, default: null }, // If null, send in the channel where they leveled up

    // Ticket System
    ticketCategoryId: { type: String, default: null },
    ticketSupportRoleId: { type: String, default: null },
    ticketLogChannelId:  { type: String, default: null },

    // Suggestions System
    suggestionChannelId: { type: String, default: null },

    // Voice Setup (Join to Create)
    voiceGeneratorId: { type: String, default: null },
    voiceCategoryId:  { type: String, default: null },

    // Birthdays
    birthdayChannelId: { type: String, default: null },
    birthdayMessage:   { type: String, default: 'Happy Birthday {user}! 🎉' },

    // Server Stats
    statsEnabled: { type: Boolean, default: false },
    statsCategoryId: { type: String, default: null },
    statsMemberChannelId: { type: String, default: null },
    statsBotChannelId: { type: String, default: null },
});

module.exports = model('GuildConfig', guildConfigSchema);
