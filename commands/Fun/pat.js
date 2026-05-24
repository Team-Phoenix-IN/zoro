const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Gently pat someone on the head.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to pat')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animu/pat');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xADD8E6) // Light Blue
                .setDescription(`**${interaction.user.username}** pats **${target.username}**'s head! *pat pat*`)
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            console.error('Pat API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} gently pats ${target.username}*` });
        }
    }
};
