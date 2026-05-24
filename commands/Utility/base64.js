const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('base64')
        .setDescription('Encode or decode text in Base64 format.')
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Whether to encode or decode')
                .setRequired(true)
                .addChoices(
                    { name: 'Encode', value: 'encode' },
                    { name: 'Decode', value: 'decode' }
                )
        )
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to process')
                .setRequired(true)
        ),
    async execute(interaction) {
        const action = interaction.options.getString('action');
        const text = interaction.options.getString('text');

        let result = '';

        if (action === 'encode') {
            result = Buffer.from(text).toString('base64');
        } else {
            result = Buffer.from(text, 'base64').toString('utf8');
            if (!result || result.includes('')) {
                return interaction.reply({ content: 'Invalid Base64 string provided for decoding.', ephemeral: true });
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71) // Green
            .setTitle(`Base64 ${action === 'encode' ? 'Encoder' : 'Decoder'}`)
            .addFields(
                { name: 'Input', value: `\`\`\`\n${text}\n\`\`\``, inline: false },
                { name: 'Output', value: `\`\`\`\n${result}\n\`\`\``, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
