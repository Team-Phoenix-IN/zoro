const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vaporwave')
        .setDescription('c o n v e r t s   t e x t   i n t o   v a p o r w a v e.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to convert')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        // Fullwidth spacing
        const vaporwave = text.split('').join(' ');

        await interaction.reply({ content: vaporwave });
    }
};
