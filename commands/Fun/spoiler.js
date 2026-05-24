const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spoiler')
        .setDescription('Wraps every single letter of your text in Discord spoiler tags.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to hide')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const spoilerText = text.split('').map(char => {
            return char === ' ' ? ' ' : `||${char}||`;
        }).join('');

        if (spoilerText.length > 2000) {
            return interaction.reply({ content: 'Your text is too long to be spoiled! Please shorten it.', ephemeral: true });
        }

        await interaction.reply({ content: spoilerText });
    }
};
