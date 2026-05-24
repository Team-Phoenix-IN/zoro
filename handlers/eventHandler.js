const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(eventsPath)) fs.mkdirSync(eventsPath);

    const eventFolders = fs.readdirSync(eventsPath);
    let eventCount = 0;

    for (const folder of eventFolders) {
        const folderPath = path.join(eventsPath, folder);
        
        // Skip if not a directory
        if (!fs.lstatSync(folderPath).isDirectory()) continue;

        const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const eventPath = path.join(folderPath, file);
            const event = require(eventPath);

            if (typeof event === 'function') {
                // If the file exports a function, execute it directly and pass the client
                event(client);
            } else if (event.name && event.execute) {
                // If the file exports an object (standard djs v14 format)
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            } else {
                console.warn(`[WARNING] The event at ${eventPath} is missing a required "name" or "execute" property, or is not a function.`);
                continue; // Skip counting this as loaded
            }
            eventCount++;
        }
    }
    
    console.log(`Loaded ${eventCount} events.`);
};
