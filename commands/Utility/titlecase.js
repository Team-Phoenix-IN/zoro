const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('titlecase')
        .setDescription('Capitalizes the first letter of every word.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const titleCase = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        await interaction.reply({ content: `\`\`\`\n${titleCase}\n\`\`\`` });
    }
};
