const { SlashCommandBuilder } = require('discord.js');

const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': ' '
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('morse')
        .setDescription('Translates your text into Morse code.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to translate (letters and numbers only)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text').toUpperCase();
        
        const morse = text.split('').map(char => {
            return morseCodeMap[char] || char; // Leave unknowns as they are
        }).join(' ');

        if (morse.length > 2000) {
            return interaction.reply({ content: 'The translated text is too long! Please shorten it.', ephemeral: true });
        }

        await interaction.reply({ content: `\`\`\`\n${morse}\n\`\`\`` });
    }
};
