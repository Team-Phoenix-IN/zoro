const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '..', 'commands');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

    const commandFolders = fs.readdirSync(commandsPath);
    let commandCount = 0;

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        
        // Skip if not a directory
        if (!fs.lstatSync(folderPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandPath = path.join(folderPath, file);
            const command = require(commandPath);

            if ('data' in command && 'execute' in command) {
                command.category = folder.toLowerCase();
                client.commands.set(command.data.name, command);
                commandCount++;
            } else {
                console.log(`[WARNING] The command at ${commandPath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    
    console.log(`Loaded ${commandCount} slash commands.`);
};
