const { Schema, model } = require('mongoose');

const afkSchema = new Schema({
    guildId:   { type: String, required: true },
    userId:    { type: String, required: true },
    reason:    { type: String, default: 'AFK' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = model('AFK', afkSchema);
