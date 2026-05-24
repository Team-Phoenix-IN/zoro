require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

client.commands = new Collection();

// Load handlers
const handlersPath = path.join(__dirname, 'handlers');
if (fs.existsSync(handlersPath)) {
    const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));
    for (const file of handlerFiles) {
        require(path.join(handlersPath, file))(client);
    }
}

async function start() {
    // 1. Connect to MongoDB FIRST — must be ready before any Discord events fire
    if (process.env.MONGO_URI) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                dbName: 'zorov3',          // explicit DB name avoids Atlas buffering issues
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
            });
            console.log('✅ Connected to MongoDB.');
        } catch (err) {
            console.error('❌ Failed to connect to MongoDB:', err);
            process.exit(1); // Don't start the bot if DB is unavailable
        }
    } else {
        console.warn('⚠️  No MONGO_URI provided in .env — skipping database connection.');
    }

    // 2. Login to Discord AFTER MongoDB is ready
    if (process.env.DISCORD_TOKEN) {
        await client.login(process.env.DISCORD_TOKEN);
        console.log('✅ Logged in to Discord.');
        
        // 3. Start the Web Dashboard
        try {
            require('./dashboard.js');
            console.log('🌐 Web Dashboard initialized.');
        } catch (dashboardErr) {
            console.error('❌ Failed to start dashboard:', dashboardErr);
        }
    } else {
        console.error('❌ No DISCORD_TOKEN provided in .env');
        process.exit(1);
    }
}

start();
