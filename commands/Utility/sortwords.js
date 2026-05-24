const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sortwords')
        .setDescription('Sorts all words in the sentence alphabetically.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to sort')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const sorted = text.split(/\s+/).sort((a, b) => a.localeCompare(b)).join(' ');

        await interaction.reply({ content: `\`\`\`\n${sorted}\n\`\`\`` });
    }
};
