const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('palindrome')
        .setDescription('Checks if your text is a valid palindrome.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to check')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const cleanStr = text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isPalindrome = cleanStr === cleanStr.split('').reverse().join('');

        const embed = new EmbedBuilder()
            .setColor(isPalindrome ? 0x2ECC71 : 0xE74C3C)
            .setTitle('Palindrome Checker')
            .setDescription(`**"${text}"**\n\n${isPalindrome ? '✅ This is a palindrome!' : '❌ This is not a palindrome.'}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
