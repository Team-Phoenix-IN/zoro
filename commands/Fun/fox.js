const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fox')
        .setDescription('Get a random picture of a cute fox.'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://randomfox.ca/floof/');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xE67E22)
                .setTitle('🦊 What does the fox say?')
                .setImage(data.image)
                .setFooter({ text: 'Powered by randomfox.ca' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Fox API Error:', error);
            await interaction.editReply({ content: 'An error occurred while fetching the fox image.' });
        }
    }
};
