const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wink')
        .setDescription('Wink at another user!')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to wink at')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animu/wink');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xFFD700) // Gold
                .setDescription(`**${interaction.user.username}** winks at **${target.username}** 😉`)
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            console.error('Wink API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} winks at ${target.username}*` });
        }
    }
};
