const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subtract')
        .setDescription('Subtracts the second number from the first.')
        .addNumberOption(option => option.setName('num1').setDescription('First number').setRequired(true))
        .addNumberOption(option => option.setName('num2').setDescription('Second number').setRequired(true)),
    async execute(interaction) {
        const num1 = interaction.options.getNumber('num1');
        const num2 = interaction.options.getNumber('num2');
        const result = num1 - num2;

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setTitle('➖ Subtraction')
            .setDescription(`**${num1}** - **${num2}** = **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
