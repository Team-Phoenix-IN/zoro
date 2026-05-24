const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kebabcase')
        .setDescription('Converts your standard sentence into kebab-case-format.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to format')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const kebabCase = text.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');

        await interaction.reply({ content: `\`\`\`\n${kebabCase}\n\`\`\`` });
    }
};
