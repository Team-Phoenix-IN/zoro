const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('squareroot')
        .setDescription('Calculates the square root of a number.')
        .addNumberOption(option => option.setName('number').setDescription('The number to calculate').setRequired(true)),
    async execute(interaction) {
        const num = interaction.options.getNumber('number');
        
        if (num < 0) {
            return interaction.reply({ content: 'You cannot calculate the square root of a negative number in real numbers!', ephemeral: true });
        }
        
        const result = Math.sqrt(num);

        const embed = new EmbedBuilder()
            .setColor(0x1ABC9C)
            .setTitle('📐 Square Root')
            .setDescription(`√**${num}** = **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
