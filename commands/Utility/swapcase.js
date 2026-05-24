const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('swapcase')
        .setDescription('Swaps the casing of every letter in a sentence.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const swapCase = text.split('').map(c => {
            if (c === c.toUpperCase()) return c.toLowerCase();
            return c.toUpperCase();
        }).join('');

        await interaction.reply({ content: `\`\`\`\n${swapCase}\n\`\`\`` });
    }
};
