const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Search Urban Dictionary for a slang term.')
        .addStringOption(option => 
            option.setName('term')
                .setDescription('The word to search for')
                .setRequired(true)
        ),
    async execute(interaction) {
        const term = interaction.options.getString('term');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
            const data = response.data;

            if (!data.list || !data.list.length) {
                return interaction.editReply({ content: `No definitions found for **${term}**.` });
            }

            const result = data.list[0];

            let definition = result.definition.replace(/\[|\]/g, '');
            if (definition.length > 2048) definition = definition.substring(0, 2045) + '...';

            let example = result.example.replace(/\[|\]/g, '');
            if (example.length > 1024) example = example.substring(0, 1021) + '...';

            const embed = new EmbedBuilder()
                .setColor(0x134FE6)
                .setTitle(`Urban Dictionary: ${result.word}`)
                .setURL(result.permalink)
                .addFields(
                    { name: 'Definition', value: definition },
                    { name: 'Example', value: example || 'No example provided.' },
                    { name: 'Rating', value: `👍 ${result.thumbs_up} | 👎 ${result.thumbs_down}` }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Urban Dictionary API Error:', error);
            await interaction.editReply({ content: 'An error occurred while communicating with Urban Dictionary.' });
        }
    }
};
