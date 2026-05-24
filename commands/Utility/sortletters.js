const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sortletters')
        .setDescription('Sorts all letters in the text alphabetically.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to sort')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const sorted = text.split('').sort().join('');

        await interaction.reply({ content: `\`\`\`\n${sorted}\n\`\`\`` });
    }
};
