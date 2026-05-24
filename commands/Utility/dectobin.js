const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dectobin')
        .setDescription('Converts a Decimal number into a Binary string.')
        .addIntegerOption(option => 
            option.setName('decimal')
                .setDescription('The decimal number to convert')
                .setRequired(true)
        ),
    async execute(interaction) {
        const decimal = interaction.options.getInteger('decimal');
        
        const binary = decimal.toString(2);

        await interaction.reply({ content: `**Decimal:** \`${decimal}\`\n**Binary:** \`${binary}\`` });
    }
};
