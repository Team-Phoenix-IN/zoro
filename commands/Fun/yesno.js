const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yesno')
        .setDescription('Let the bot make a decision for you with a simple yes or no.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question you want to ask')
                .setRequired(false)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        await interaction.deferReply();

        try {
            const response = await axios.get('https://yesno.wtf/api');
            const data = response.data;

            const embed = new EmbedBuilder()
                .setColor(data.answer === 'yes' ? 0x2ECC71 : 0xE74C3C)
                .setTitle(data.answer.toUpperCase())
                .setImage(data.image)
                .setTimestamp();

            if (question) {
                embed.setDescription(`**Question:** ${question}`);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('YesNo API Error:', error);
            await interaction.editReply({ content: 'Could not fetch a yes/no right now.' });
        }
    }
};
