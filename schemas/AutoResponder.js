const { Schema, model } = require('mongoose');

const autoResponderSchema = new Schema({
    guildId:  { type: String, required: true },
    trigger:  { type: String, required: true },
    response: { type: String, required: true }
});

module.exports = model('AutoResponder', autoResponderSchema);
