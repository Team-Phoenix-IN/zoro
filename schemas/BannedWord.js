const { Schema, model } = require('mongoose');

const bannedWordSchema = new Schema({
    guildId: { type: String, required: true },
    word:    { type: String, required: true }
});

module.exports = model('BannedWord', bannedWordSchema);
