const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('length')
        .setDescription('Analyzes text and returns the exact character and word count.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to analyze')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const charCount = text.length;
        const charCountNoSpaces = text.replace(/\s+/g, '').length;
        const wordCount = text.trim().split(/\s+/).length;

        const embed = new EmbedBuilder()
            .setColor(0x95A5A6)
            .setTitle('📝 Text Analysis')
            .addFields(
                { name: 'Words', value: `${wordCount}`, inline: true },
                { name: 'Characters (with spaces)', value: `${charCount}`, inline: true },
                { name: 'Characters (without spaces)', value: `${charCountNoSpaces}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
