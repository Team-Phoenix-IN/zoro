const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cuddle')
        .setDescription('Cuddle with another user!')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to cuddle')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animu/cuddle');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xFFC0CB) // Pink
                .setDescription(`**${interaction.user.username}** cuddles with **${target.username}**! 💕`)
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            console.error('Cuddle API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} cuddles with ${target.username}*` });
        }
    }
};
