const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pathcase')
        .setDescription('Replaces all spaces with slashes.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const pathCase = text.trim().toLowerCase().replace(/\s+/g, '/');

        await interaction.reply({ content: `\`\`\`\n${pathCase}\n\`\`\`` });
    }
};
