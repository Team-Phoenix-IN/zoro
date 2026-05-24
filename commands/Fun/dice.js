const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Roll a 6-sided die!'),
    async execute(interaction) {
        const roll = Math.floor(Math.random() * 6) + 1;

        const embed = new EmbedBuilder()
            .setColor(0x95A5A6)
            .setTitle('🎲 Dice Roll')
            .setDescription(`You rolled a **${roll}**!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
