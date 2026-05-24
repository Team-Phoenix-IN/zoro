const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Send a virtual kiss to a user!')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to kiss')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        // Trying to kiss the bot
        if (target.id === interaction.client.user.id) {
            return interaction.editReply({ content: 'I am flattered, but my heart belongs to the code! 🤖' });
        }

        try {
            const response = await axios.get('https://some-random-api.com/animu/kiss');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xFF007F) // Rose/Pink
                .setDescription(`**${interaction.user.username}** kisses **${target.username}**! 💋`)
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            console.error('Kiss API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} kisses ${target.username}*` });
        }
    }
};
