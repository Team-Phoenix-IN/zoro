const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('piglatin')
        .setDescription('Translates your text into Pig Latin.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const pigLatin = text.split(' ').map(word => {
            // Check if the word starts with a vowel
            if (/^[aeiou]/i.test(word)) {
                return word + 'way';
            } else {
                // Find where the first vowel is
                const firstVowelMatch = word.match(/[aeiou]/i);
                if (firstVowelMatch) {
                    const vowelIndex = word.indexOf(firstVowelMatch[0]);
                    const consonantCluster = word.slice(0, vowelIndex);
                    const restOfWord = word.slice(vowelIndex);
                    return restOfWord + consonantCluster + 'ay';
                }
                // If there are no vowels (e.g. "cry", "rhythm" - wait "y" can be a vowel, but keeping it simple)
                return word + 'ay';
            }
        }).join(' ');

        await interaction.reply({ content: pigLatin });
    }
};
