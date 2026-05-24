const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dotcase')
        .setDescription('Replaces all spaces with dots.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const dotCase = text.trim().toLowerCase().replace(/\s+/g, '.');

        await interaction.reply({ content: `\`\`\`\n${dotCase}\n\`\`\`` });
    }
};
