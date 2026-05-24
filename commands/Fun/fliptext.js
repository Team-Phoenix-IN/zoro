const { SlashCommandBuilder } = require('discord.js');

const flipMap = {
    a: '\u0250', b: 'q', c: '\u0254', d: 'p', e: '\u01DD', f: '\u025F', g: '\u0183', h: '\u0265', i: '\u0131',
    j: '\u027E', k: '\u029E', l: 'l', m: '\u026F', n: 'u', o: 'o', p: 'd', q: 'b', r: '\u0279', s: 's',
    t: '\u0287', u: 'n', v: '\u028C', w: '\u028D', x: 'x', y: '\u028E', z: 'z',
    A: '\u2200', B: '\u03FA', C: '\u039B', D: '\u15E1', E: '\u018E', F: '\u2132', G: '\u05E4', H: 'H', I: 'I',
    J: '\u017F', K: '\u22CA', L: '\u02E5', M: 'W', N: 'N', O: 'O', P: '\u0500', Q: '\u038C', R: '\u1D1A', S: 'S',
    T: '\u22A5', U: '\u2229', V: '\u039B', W: 'M', X: 'X', Y: '\u2144', Z: 'Z',
    '1': '\u21C2', '2': '\u1105', '3': '\u0190', '4': '\u3123', '5': '\u03DB', '6': '9', '7': '\u3125', '8': '8', '9': '6', '0': '0',
    '.': '\u02D9', ',': "\'", "\'": ',', '\"': '\u201E', '!': '\u00A1', '?': '\u00BF', '<': '>', '>': '<', '^': 'v', 'v': '^'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fliptext')
        .setDescription('Flips your text upside down (\u02D9u\u028Dop \u01DDp\u0131sdn).')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to flip')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const flipped = text.split('').reverse().map(char => flipMap[char] || char).join('');

        await interaction.reply({ content: flipped });
    }
};
