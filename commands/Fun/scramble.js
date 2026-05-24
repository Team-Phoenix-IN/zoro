const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scramble')
        .setDescription('Scrambles the letters of your text into a complete mess.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to scramble')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const scrambled = text.split('').sort(() => 0.5 - Math.random()).join('');

        await interaction.reply({ content: scrambled });
    }
};
