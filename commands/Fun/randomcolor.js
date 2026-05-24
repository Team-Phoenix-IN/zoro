const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcolor')
        .setDescription('Generates a random Hex color code.'),
    async execute(interaction) {
        const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const hex = `#${color.toUpperCase()}`;

        const embed = new EmbedBuilder()
            .setColor(hex)
            .setTitle('🎨 Random Color Generator')
            .setDescription(`**Hex Code:** \`${hex}\``)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
