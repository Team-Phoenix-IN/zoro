const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whisper')
        .setDescription('Converts text to lowercase and wraps it in italics.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to whisper')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const whispered = `*${text.toLowerCase()}*`;
        
        await interaction.reply({ content: whispered });
    }
};
