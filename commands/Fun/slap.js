const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Playfully slap a user!')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to slap')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        await interaction.deferReply();

        // Trying to slap the bot
        if (target.id === interaction.client.user.id) {
            return interaction.editReply({ content: 'Ouch! Why would you do that to me?! 😢' });
        }

        try {
            const response = await axios.get('https://some-random-api.com/animu/slap');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(0xFF4500) // Orange Red
                .setDescription(`**${interaction.user.username}** slapped **${target.username}**! 💥`)
                .setImage(data.link)
                .setTimestamp();

            await interaction.editReply({ content: `<@${target.id}>`, embeds: [embed] });
        } catch (error) {
            console.error('Slap API Error:', error);
            await interaction.editReply({ content: `*${interaction.user.username} slaps ${target.username}*` });
        }
    }
};
