const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('baka')
        .setDescription('Call someone an idiot (affectionately, in anime style).')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The baka')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        try {
            const response = await axios.get('https://some-random-api.com/animu/baka');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xE74C3C) // Red
                .setDescription(`**${interaction.user.username}** calls **${target.username}** a Baka! (Idiot!) 💢`)
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            console.error('Baka API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} calls ${target.username} a baka!*` });
        }
    }
};
