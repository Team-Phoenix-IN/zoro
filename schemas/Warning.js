const { Schema, model } = require('mongoose');

const warningSchema = new Schema({
    guildId:     { type: String, required: true },
    userId:      { type: String, required: true },
    moderatorId: { type: String, required: true },
    reason:      { type: String, default: 'No reason provided' },
    timestamp:   { type: Date, default: Date.now }
});

module.exports = model('Warning', warningSchema);
