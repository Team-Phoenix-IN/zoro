const { Schema, model } = require('mongoose');

const buttonRolePanelSchema = new Schema({
    guildId:     { type: String, required: true },
    channelId:   { type: String, required: true },
    title:       { type: String, default: 'Reaction Roles' },
    description: { type: String, default: 'Click a button below to get a role!' },
    buttons: [{
        label: { type: String, required: true },
        emoji: { type: String, default: '🏷️' },
        roleId: { type: String, required: true },
        style: { type: Number, default: 1 } // Primary=1, Secondary=2, Success=3, Danger=4
    }],
    messageId:   { type: String, default: null } // ID of the sent panel message
});

module.exports = model('ButtonRolePanel', buttonRolePanelSchema);
