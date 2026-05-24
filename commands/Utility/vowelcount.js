const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vowelcount')
        .setDescription('Scans your text and returns the exact number of vowels used.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to analyze')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const count = (text.match(/[aeiou]/gi) || []).length;

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🅰️ Vowel Counter')
            .setDescription(`Found **${count}** vowels in your text!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
