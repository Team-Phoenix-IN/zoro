const { SlashCommandBuilder } = require('discord.js');

// Helper function for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('Hack someone (100% real, not fake at all).')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to hack')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        // Prevent hacking the bot
        if (target.id === interaction.client.user.id) {
            return interaction.reply({ content: `You can't hack me, my firewall is too strong! 🛡️`, ephemeral: true });
        }

        // Initial reply
        await interaction.reply({ content: `[10%] Hacking ${target}... 💻` });

        // A sequence of fake hacking messages
        const hackMessages = [
            `[25%] Finding IP address...`,
            `[40%] IP Found: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            `[55%] Bypassing Discord Two-Factor Authentication...`,
            `[70%] Extracting most used words: "bruh", "lol", "sus"`,
            `[85%] Selling browser history to the dark web...`,
            `[100%] Hack complete! The FBI is on their way. 🚓`
        ];

        // Edit the message progressively
        for (const msg of hackMessages) {
            await delay(1500 + Math.random() * 1000); // Wait 1.5 to 2.5 seconds between edits
            
            // Try/catch just in case the interaction or message was deleted by the user mid-hack
            try {
                await interaction.editReply({ content: msg });
            } catch (error) {
                console.error('Hack command edit failed (message likely deleted).');
                break;
            }
        }
    }
};
