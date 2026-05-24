const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        // Set the bot's rich presence / activity status
        client.user.setPresence({
            activities: [{
                name: 'New Era Of the Phoenix!',
                type: ActivityType.Playing
            }],
            status: 'dnd',
        });

        const activityName = client.user.presence.activities[0]?.name || 'Unknown';
        console.log(`Bot activity status set to "Playing ${activityName}" [${client.user.presence.status}]`);
    },
};
