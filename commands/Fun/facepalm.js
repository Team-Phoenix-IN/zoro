const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('facepalm')
        .setDescription('Facepalm at someone\'s sheer stupidity.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user who made you facepalm')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animu/face-palm');
            const data = response.data;

            const description = target 
                ? `**${interaction.user.username}** facepalms at **${target.username}** 🤦‍♂️`
                : `**${interaction.user.username}** facepalms 🤦‍♂️`;

            const embed = new EmbedBuilder()
                .setColor(0xE74C3C) // Red
                .setDescription(description)
                .setImage(data.link)
                .setTimestamp();

            const content = target ? `<@${target.id}>` : undefined;
            await interaction.editReply({ content: content, embeds: [embed] });
        } catch (error) {
            console.error('Facepalm API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} facepalms*` });
        }
    }
};
