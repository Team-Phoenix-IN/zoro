const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leet')
        .setDescription('Translates your text into 1337 (leet) speak.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const leetMap = {
            'a': '4', 'A': '4',
            'e': '3', 'E': '3',
            'i': '1', 'I': '1',
            'o': '0', 'O': '0',
            's': '5', 'S': '5',
            't': '7', 'T': '7',
            'b': '8', 'B': '8',
            'g': '9', 'G': '9'
        };

        const leet = text.split('').map(char => leetMap[char] || char).join('');

        await interaction.reply({ content: leet });
    }
};
