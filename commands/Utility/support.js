const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get a link to our official support server.'),
    async execute(interaction) {
        // You can replace this URL with your actual support server discord.gg link!
        const supportUrl = 'https://discord.gg/your-support-invite';

        const embed = new EmbedBuilder()
            .setColor(0x3498DB) // Blue
            .setTitle('🛠️ Need Help?')
            .setDescription(`Join our official support server to ask questions, report bugs, or suggest features!\n\n🔗 [Join Support Server](${supportUrl})`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
