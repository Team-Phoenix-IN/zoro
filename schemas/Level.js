const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
    guildId: { type: String, required: true },
    userId:  { type: String, required: true },
    xp:      { type: Number, default: 0 },
    level:   { type: Number, default: 0 },
    lastMessageDate: { type: Date, default: Date.now } // for cooldowns
});

// Compound index to ensure one record per user per guild
levelSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = model('Level', levelSchema);
