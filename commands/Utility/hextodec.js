const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hextodec')
        .setDescription('Converts a Hexadecimal string into a Decimal number.')
        .addStringOption(option => 
            option.setName('hex')
                .setDescription('The hex string to convert')
                .setRequired(true)
        ),
    async execute(interaction) {
        const hex = interaction.options.getString('hex');
        const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');

        if (!cleanHex) {
            return interaction.reply({ content: 'Invalid hexadecimal string provided.', ephemeral: true });
        }

        const decimal = parseInt(cleanHex, 16);

        await interaction.reply({ content: `**Hex:** \`${hex}\`\n**Decimal:** \`${decimal}\`` });
    }
};
