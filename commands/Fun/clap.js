const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clap')
        .setDescription('Replaces spaces in your text with the clap emoji.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to clapify')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const clapped = text.split(' ').join(' 👏 ');

        await interaction.reply({ content: `👏 ${clapped} 👏` });
    }
};
