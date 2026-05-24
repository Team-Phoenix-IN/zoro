const { Schema, model } = require('mongoose');

const reputationSchema = new Schema({
    guildId: { type: String, required: true },
    userId:  { type: String, required: true },
    rep:     { type: Number, default: 0 },
    lastThanked: { type: Date, default: null } // To handle cooldowns
});

module.exports = model('Reputation', reputationSchema);
