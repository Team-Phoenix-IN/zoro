const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('Generate a QR code from any text or link.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text or URL to encode')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        // Use the goqr.me API to generate a QR Code image URL
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;

        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle('QR Code Generator')
            .setImage(qrUrl)
            .setFooter({ text: 'Powered by goqr.me' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
