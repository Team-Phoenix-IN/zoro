const { Schema, model } = require('mongoose');

const birthdaySchema = new Schema({
    guildId: { type: String, required: true },
    userId:  { type: String, required: true },
    month:   { type: Number, required: true }, // 1-12
    day:     { type: Number, required: true }  // 1-31
});

// Compound index to ensure one birthday per user per guild
birthdaySchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = model('Birthday', birthdaySchema);
