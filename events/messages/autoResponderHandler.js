const AutoResponder = require('../../schemas/AutoResponder');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;

        try {
            // Check if there's any trigger for this exact message content
            const responder = await AutoResponder.findOne({ 
                guildId: message.guild.id, 
                trigger: { $regex: new RegExp(`^${message.content}$`, 'i') } 
            });

            if (responder) {
                // If the trigger matches exactly (case insensitive), reply
                await message.reply(responder.response);
            }
        } catch (error) {
            console.error('Error in autoResponderHandler:', error);
        }
    });
};
