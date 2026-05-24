const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('binary')
        .setDescription('Translate text to binary code, or binary to text.')
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Whether to encode (text to binary) or decode (binary to text)')
                .setRequired(true)
                .addChoices(
                    { name: 'Encode', value: 'encode' },
                    { name: 'Decode', value: 'decode' }
                )
        )
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text or binary to process')
                .setRequired(true)
        ),
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const text = interaction.options.getString('text');

        let result = '';

        if (action === 'encode') {
            result = text.split('').map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }).join(' ');
        } else {
            try {
                // Remove spaces and split by 8 chars if no spaces, or split by spaces
                const binaryArray = text.includes(' ') ? text.split(' ') : text.match(/.{1,8}/g);
                result = binaryArray.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
            } catch (err) {
                return interaction.reply({ content: 'Invalid binary string provided for decoding.', ephemeral: true });
            }
        }

        if (result.length > 1024) result = result.substring(0, 1021) + '...';

        const embed = new EmbedBuilder()
            .setColor(0x1ABC9C) // Teal
            .setTitle(`Binary ${action === 'encode' ? 'Encoder' : 'Decoder'}`)
            .addFields(
                { name: 'Input', value: `\`\`\`\n${text.length > 1024 ? text.substring(0, 1021) + '...' : text}\n\`\`\``, inline: false },
                { name: 'Output', value: `\`\`\`\n${result}\n\`\`\``, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
