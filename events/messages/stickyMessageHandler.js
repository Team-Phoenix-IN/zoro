const StickyMessage = require('../../schemas/StickyMessage');

// In-memory cache to prevent spamming the database on every single message
// Format: channelId -> lastMessageId
const stickyCache = new Map();

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;

        try {
            const sticky = await StickyMessage.findOne({ guildId: message.guild.id, channelId: message.channel.id });
            if (!sticky) return;

            // If the latest message was sent by the bot and it IS the sticky message, do nothing
            // (Wait, bot ignores itself above. But we need to ensure we don't double post)
            
            // Delete the old sticky message
            if (sticky.lastMessageId) {
                try {
                    const oldMsg = await message.channel.messages.fetch(sticky.lastMessageId);
                    if (oldMsg) await oldMsg.delete();
                } catch (e) {
                    // Message might already be deleted, ignore
                }
            }

            // Send new sticky message
            const newMsg = await message.channel.send(`📌 **Sticky Message**\n\n${sticky.content}`);
            
            // Update database with new message ID
            sticky.lastMessageId = newMsg.id;
            await sticky.save();

        } catch (error) {
            console.error('Error in stickyMessageHandler:', error);
        }
    });
};
