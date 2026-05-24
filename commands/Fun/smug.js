const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('smug')
        .setDescription('Look at someone smugly.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to look at')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animu/smug');
            const data = response.data;

            const description = target 
                ? `**${interaction.user.username}** looks smugly at **${target.username}** 😏`
                : `**${interaction.user.username}** is feeling smug 😏`;

            const embed = new EmbedBuilder()
                .setColor(0xF1C40F) // Gold/Yellow
                .setDescription(description)
                .setImage(data.link)
                .setTimestamp();

            const content = target ? `<@${target.id}>` : undefined;
            await interaction.editReply({ content: content, embeds: [embed] });
        } catch (error) {
            console.error('Smug API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} smirks smugly*` });
        }
    }
};
