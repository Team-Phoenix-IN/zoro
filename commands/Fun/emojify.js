const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Converts your text into huge regional indicator emojis.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to emojify (letters and numbers only)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text').toLowerCase();
        
        const specialCodes = {
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            '9': ':nine:',
            '#': ':hash:',
            '*': ':asterisk:',
            '?': ':grey_question:',
            '!': ':grey_exclamation:',
            ' ': '   '
        };

        const emojified = text.split('').map(char => {
            if (/[a-z]/.test(char)) {
                return `:regional_indicator_${char}:`;
            } else if (specialCodes[char]) {
                return specialCodes[char];
            }
            return char;
        }).join(' ');

        if (emojified.length > 2000) {
            return interaction.reply({ content: 'Your text is too long to be emojified! Please shorten it.', ephemeral: true });
        }

        await interaction.reply({ content: emojified });
    }
};
