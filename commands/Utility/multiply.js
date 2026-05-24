const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('multiply')
        .setDescription('Multiplies two numbers together.')
        .addNumberOption(option => option.setName('num1').setDescription('First number').setRequired(true))
        .addNumberOption(option => option.setName('num2').setDescription('Second number').setRequired(true)),
    async execute(interaction) {
        const num1 = interaction.options.getNumber('num1');
        const num2 = interaction.options.getNumber('num2');
        const result = num1 * num2;

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71)
            .setTitle('✖️ Multiplication')
            .setDescription(`**${num1}** × **${num2}** = **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
