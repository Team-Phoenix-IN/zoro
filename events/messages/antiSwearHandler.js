const BannedWord = require('../../schemas/BannedWord');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;

        try {
            // In a real large-scale bot, you'd cache these per-guild
            // rather than fetching on every single message.
            const bannedWords = await BannedWord.find({ guildId: message.guild.id });
            if (!bannedWords.length) return;

            const content = message.content.toLowerCase();
            
            // Check if message contains any of the banned words
            const isBanned = bannedWords.some(bw => content.includes(bw.word));

            if (isBanned) {
                await message.delete();
                await message.channel.send({ 
                    content: `<@${message.author.id}>, your message was deleted because it contained a banned word.` 
                }).then(msg => {
                    // Auto delete warning after 5 seconds
                    setTimeout(() => msg.delete().catch(() => {}), 5000);
                });
            }
        } catch (error) {
            console.error('Error in antiSwearHandler:', error);
        }
    });
};
