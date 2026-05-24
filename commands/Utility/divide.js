const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('divide')
        .setDescription('Divides the first number by the second.')
        .addNumberOption(option => option.setName('num1').setDescription('First number').setRequired(true))
        .addNumberOption(option => option.setName('num2').setDescription('Second number').setRequired(true)),
    async execute(interaction) {
        const num1 = interaction.options.getNumber('num1');
        const num2 = interaction.options.getNumber('num2');
        
        if (num2 === 0) {
            return interaction.reply({ content: 'Nice try, but you cannot divide by zero!', ephemeral: true });
        }
        
        const result = num1 / num2;

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('➗ Division')
            .setDescription(`**${num1}** ÷ **${num2}** = **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
