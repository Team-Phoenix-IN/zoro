const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Search for a GitHub user.')
        .addStringOption(option => 
            option.setName('username')
                .setDescription('The GitHub username to search for')
                .setRequired(true)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x2b3137)
                .setTitle(`${data.login}'s GitHub Profile`)
                .setURL(data.html_url)
                .setThumbnail(data.avatar_url)
                .addFields(
                    { name: 'Name', value: data.name || 'Not provided', inline: true },
                    { name: 'Company', value: data.company || 'Not provided', inline: true },
                    { name: 'Location', value: data.location || 'Not provided', inline: true },
                    { name: 'Public Repos', value: String(data.public_repos), inline: true },
                    { name: 'Followers', value: String(data.followers), inline: true },
                    { name: 'Following', value: String(data.following), inline: true }
                )
                .setTimestamp();

            if (data.bio) {
                embed.setDescription(data.bio);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await interaction.editReply({ content: `Could not find a GitHub user named **${username}**.` });
            } else {
                console.error('GitHub API Error:', error);
                await interaction.editReply({ content: 'An error occurred while communicating with the GitHub API.' });
            }
        }
    }
};
