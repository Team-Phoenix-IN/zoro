const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wordreverse')
        .setDescription('Reverses the order of words in a sentence.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to reverse')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const reversed = text.split(' ').reverse().join(' ');

        await interaction.reply({ content: reversed });
    }
};
