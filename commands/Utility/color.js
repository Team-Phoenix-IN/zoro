const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('View the visual representation of a Hex Color Code.')
        .addStringOption(option => 
            option.setName('hex')
                .setDescription('The hex code (e.g. FF0000 or #FF0000)')
                .setRequired(true)
        ),
    async execute(interaction) {
        let hex = interaction.options.getString('hex');
        
        // Remove the hashtag if the user included it
        if (hex.startsWith('#')) {
            hex = hex.substring(1);
        }

        // Basic hex validation
        const hexRegex = /^[0-9A-Fa-f]{6}$/i;
        if (!hexRegex.test(hex)) {
            return interaction.reply({ content: 'Please provide a valid 6-character hex code (e.g. FF0000).', ephemeral: true });
        }

        const colorUrl = `https://some-random-api.com/canvas/misc/colorviewer?hex=${hex}`;

        const embed = new EmbedBuilder()
            .setColor(parseInt(hex, 16))
            .setTitle(`Color: #${hex.toUpperCase()}`)
            .setImage(colorUrl)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
