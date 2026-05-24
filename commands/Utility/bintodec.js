const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bintodec')
        .setDescription('Converts a Binary string into a Decimal number.')
        .addStringOption(option => 
            option.setName('binary')
                .setDescription('The binary string to convert')
                .setRequired(true)
        ),
    async execute(interaction) {
        const binary = interaction.options.getString('binary');
        
        if (!/^[01\s]+$/.test(binary)) {
            return interaction.reply({ content: 'That is not a valid binary string! Only 0s and 1s are allowed.', ephemeral: true });
        }

        const decimal = parseInt(binary.replace(/\s+/g, ''), 2);

        if (isNaN(decimal)) {
             return interaction.reply({ content: 'Failed to convert to decimal.', ephemeral: true });
        }

        await interaction.reply({ content: `**Binary:** \`${binary}\`\n**Decimal:** \`${decimal}\`` });
    }
};
