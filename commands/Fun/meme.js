const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme from Reddit.'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            const meme = response.data;

            const embed = new EmbedBuilder()
                .setTitle(meme.title)
                .setURL(meme.postLink)
                .setImage(meme.url)
                .setColor(0xff4500)
                .setFooter({ text: `👍 ${meme.ups} | r/${meme.subreddit}` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Meme API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a meme right now. Try again later!' });
        }
    }
};
