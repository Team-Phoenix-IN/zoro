const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shout')
        .setDescription('Converts text to UPPERCASE and injects screaming emojis.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to shout')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const shouted = text.toUpperCase().split('').join(' 📢 ');
        
        // Keep it under 2000 chars limit for Discord messages
        let finalMessage = `📢 ${shouted} 📢`;
        if (finalMessage.length > 2000) {
            finalMessage = finalMessage.substring(0, 1997) + '...';
        }

        await interaction.reply({ content: finalMessage });
    }
};
