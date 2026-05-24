const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hex')
        .setDescription('Converts your text into Hexadecimal code.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const hex = text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');

        if (hex.length > 2000) {
            return interaction.reply({ content: 'Your text is too long to convert to Hex!', ephemeral: true });
        }

        await interaction.reply({ content: `\`\`\`\n${hex}\n\`\`\`` });
    }
};
