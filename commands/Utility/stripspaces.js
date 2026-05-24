const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stripspaces')
        .setDescription('Removes all spaces from a sentence.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const stripped = text.replace(/\s+/g, '');

        await interaction.reply({ content: `\`\`\`\n${stripped}\n\`\`\`` });
    }
};
