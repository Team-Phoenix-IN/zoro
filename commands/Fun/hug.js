const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Give someone a virtual hug!')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to hug')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        // Trying to hug the bot
        if (target.id === interaction.client.user.id) {
            return interaction.editReply({ content: 'Aww, thank you! *hugs back* 🤗' });
        }

        try {
            const response = await axios.get('https://some-random-api.com/animu/hug');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xFFB6C1) // Light Pink
                .setDescription(`**${interaction.user.username}** gave a big hug to **${target.username}**! 🤗`)
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            console.error('Hug API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} hugs ${target.username}*` });
        }
    }
};
