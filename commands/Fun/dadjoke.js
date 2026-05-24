const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dadjoke')
        .setDescription('Tells a delightfully terrible dad joke.'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://icanhazdadjoke.com/', {
                headers: { 'Accept': 'application/json' }
            });
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x3498DB) // Blue
                .setTitle('👨 Dad Joke')
                .setDescription(data.joke)
                .setFooter({ text: 'Powered by icanhazdadjoke.com' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Dad Joke API Error:', error);
            await interaction.editReply({ content: 'I tried to think of a joke, but my brain completely stalled!' });
        }
    }
};
