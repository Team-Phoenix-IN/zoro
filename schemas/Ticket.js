const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    guildId:   { type: String, required: true },
    channelId: { type: String, required: true, unique: true },
    creatorId: { type: String, required: true },
    status:    { type: String, default: 'open' }, // open, closed
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Ticket', ticketSchema);
