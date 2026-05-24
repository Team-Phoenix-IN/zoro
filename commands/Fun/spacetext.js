const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spacetext')
        .setDescription('Injects wide spaces between every single letter.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to space out')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const spaced = text.split('').join(' ');
        
        await interaction.reply({ content: spaced });
    }
};
