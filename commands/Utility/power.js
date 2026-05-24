const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('power')
        .setDescription('Calculates a base number raised to an exponent.')
        .addNumberOption(option => option.setName('base').setDescription('The base number').setRequired(true))
        .addNumberOption(option => option.setName('exponent').setDescription('The exponent').setRequired(true)),
    async execute(interaction) {
        const base = interaction.options.getNumber('base');
        const exponent = interaction.options.getNumber('exponent');
        
        const result = Math.pow(base, exponent);

        const embed = new EmbedBuilder()
            .setColor(0xE67E22)
            .setTitle('📈 Exponents')
            .setDescription(`**${base}** ^ **${exponent}** = **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
