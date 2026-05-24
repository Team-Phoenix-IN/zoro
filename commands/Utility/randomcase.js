const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcase')
        .setDescription('Randomizes the casing of every single letter.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const randomCase = text.split('').map(c => {
            return Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase();
        }).join('');

        await interaction.reply({ content: `\`\`\`\n${randomCase}\n\`\`\`` });
    }
};
