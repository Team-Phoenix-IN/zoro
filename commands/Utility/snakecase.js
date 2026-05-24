const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snakecase')
        .setDescription('Converts your standard sentence into snake_case_format.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const snakeCase = text.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');

        await interaction.reply({ content: `\`\`\`\n${snakeCase}\n\`\`\`` });
    }
};
