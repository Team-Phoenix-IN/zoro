const AFK = require('../../schemas/AFK');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;

        const guildId = message.guild.id;

        // 1. Check if the author is returning from AFK
        try {
            const authorAfk = await AFK.findOne({ guildId, userId: message.author.id });
            if (authorAfk) {
                await AFK.deleteOne({ _id: authorAfk._id });
                
                // Remove [AFK] nickname if present
                try {
                    if (message.member && message.member.manageable && message.member.nickname?.startsWith('[AFK]')) {
                        const newName = message.member.nickname.replace('[AFK] ', '');
                        await message.member.setNickname(newName);
                    }
                } catch (e) {}

                message.channel.send(`Welcome back <@${message.author.id}>, I removed your AFK status!`).then(msg => {
                    setTimeout(() => msg.delete().catch(() => {}), 5000);
                });
            }
        } catch (err) {
            console.error('Error checking author AFK:', err);
        }

        // 2. Check if the message mentions any AFK users
        if (message.mentions.members.size > 0) {
            message.mentions.members.forEach(async (member) => {
                // Don't reply if the user pinged themselves
                if (member.id === message.author.id) return;

                try {
                    const mentionedAfk = await AFK.findOne({ guildId, userId: member.id });
                    if (mentionedAfk) {
                        const timeAgo = Math.floor(mentionedAfk.timestamp.getTime() / 1000);
                        message.reply({ 
                            content: `💤 **${member.user.username}** went AFK <t:${timeAgo}:R>: ${mentionedAfk.reason}` 
                        });
                    }
                } catch (err) {
                    console.error('Error checking mentioned AFK:', err);
                }
            });
        }
    });
};
