const { Schema, model } = require('mongoose');

const shopItemSchema = new Schema({
    guildId:     { type: String, required: true },
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    roleId:      { type: String, required: true } // Role given upon purchase
});

module.exports = model('ShopItem', shopItemSchema);
