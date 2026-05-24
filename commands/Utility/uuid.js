const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const crypto = require('crypto');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uuid')
        .setDescription('Generate a random, cryptographically secure UUID (v4).'),
    async execute(interaction) {
        const generatedUuid = crypto.randomUUID();

        const embed = new EmbedBuilder()
            .setColor(0x34495E) // Dark slate
            .setTitle('UUID Generator')
            .setDescription(`\`\`\`${generatedUuid}\`\`\``)
            .setFooter({ text: 'Version 4 (Random)' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
