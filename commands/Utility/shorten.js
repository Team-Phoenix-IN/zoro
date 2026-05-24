const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shorten')
        .setDescription('Shorten a long URL.')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('The URL to shorten')
                .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        await interaction.deferReply();

        // Basic URL validation
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return interaction.editReply({ content: 'Please provide a valid URL starting with http:// or https://' });
        }

        try {
            const response = await axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
            const data = response.data;

            if (data.errorcode) {
                return interaction.editReply({ content: `Error shortening URL: ${data.errormessage}` });
            }

            const embed = new EmbedBuilder()
                .setColor(0x3498DB) // Blue
                .setTitle('🔗 URL Shortened')
                .addFields(
                    { name: 'Original', value: url, inline: false },
                    { name: 'Shortened', value: data.shorturl, inline: false }
                )
                .setFooter({ text: 'Powered by is.gd' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('URL Shortener API Error:', error);
            await interaction.editReply({ content: 'An error occurred while shortening the URL.' });
        }
    }
};
