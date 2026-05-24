const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('consonantcount')
        .setDescription('Scans your text and returns the exact number of consonants used.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to analyze')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const count = (text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle('🅱️ Consonant Counter')
            .setDescription(`Found **${count}** consonants in your text!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
