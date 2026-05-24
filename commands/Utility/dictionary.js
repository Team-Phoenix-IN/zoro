const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription('Look up the definition of an English word.')
        .addStringOption(option => 
            option.setName('word')
                .setDescription('The word to look up')
                .setRequired(true)
        ),
    async execute(interaction) {
        const word = interaction.options.getString('word');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
            const data = response.data[0];

            const meaning = data.meanings[0];
            const definition = meaning.definitions[0].definition;
            const example = meaning.definitions[0].example || 'No example available.';
            const phonetic = data.phonetic || 'No phonetic available.';

            const embed = new EmbedBuilder()
                .setColor(0x9B59B6) // Purple
                .setTitle(`📖 ${data.word}`)
                .addFields(
                    { name: 'Phonetic', value: phonetic, inline: true },
                    { name: 'Part of Speech', value: meaning.partOfSpeech, inline: true },
                    { name: 'Definition', value: definition, inline: false },
                    { name: 'Example', value: `*${example}*`, inline: false }
                )
                .setFooter({ text: 'Powered by Free Dictionary API' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await interaction.editReply({ content: `Could not find a definition for **${word}**.` });
            } else {
                console.error('Dictionary API Error:', error);
                await interaction.editReply({ content: 'An error occurred while searching the dictionary.' });
            }
        }
    }
};
