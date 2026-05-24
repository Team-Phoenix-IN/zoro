const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Converts your text into an array of ASCII character codes.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to convert')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const ascii = text.split('').map(c => c.charCodeAt(0)).join(' ');

        if (ascii.length > 2000) {
            return interaction.reply({ content: 'Your text is too long to convert to ASCII!', ephemeral: true });
        }

        await interaction.reply({ content: `\`\`\`\n${ascii}\n\`\`\`` });
    }
};
