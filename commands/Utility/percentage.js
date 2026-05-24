const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('percentage')
        .setDescription('Calculates X% of Y.')
        .addNumberOption(option => option.setName('percent').setDescription('The percentage (e.g. 50)').setRequired(true))
        .addNumberOption(option => option.setName('number').setDescription('The number').setRequired(true)),
    async execute(interaction) {
        const percent = interaction.options.getNumber('percent');
        const num = interaction.options.getNumber('number');
        
        const result = (percent / 100) * num;

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('📊 Percentage Calculator')
            .setDescription(`**${percent}%** of **${num}** is **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
