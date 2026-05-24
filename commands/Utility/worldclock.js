const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('worldclock')
        .setDescription('Displays the current time in various major timezones.'),
    async execute(interaction) {
        const date = new Date();

        // Helper function to format time
        const formatTime = (tz) => {
            return date.toLocaleString('en-US', { timeZone: tz, timeStyle: 'short', dateStyle: 'medium' });
        };

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🌍 World Clock')
            .addFields(
                { name: 'Los Angeles (PST)', value: formatTime('America/Los_Angeles'), inline: true },
                { name: 'New York (EST)', value: formatTime('America/New_York'), inline: true },
                { name: 'London (GMT)', value: formatTime('Europe/London'), inline: true },
                { name: 'Paris (CET)', value: formatTime('Europe/Paris'), inline: true },
                { name: 'Tokyo (JST)', value: formatTime('Asia/Tokyo'), inline: true },
                { name: 'Sydney (AEST)', value: formatTime('Australia/Sydney'), inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
