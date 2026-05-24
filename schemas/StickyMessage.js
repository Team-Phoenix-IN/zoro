const { Schema, model } = require('mongoose');

const stickyMessageSchema = new Schema({
    guildId:       { type: String, required: true },
    channelId:     { type: String, required: true },
    content:       { type: String, required: true },
    lastMessageId: { type: String, default: null } // The ID of the currently sticky message to delete
});

module.exports = model('StickyMessage', stickyMessageSchema);
