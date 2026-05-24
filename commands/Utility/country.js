const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('country')
        .setDescription('Look up information about any country.')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The name of the country')
                .setRequired(true)
        ),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
            const data = response.data[0];

            let languages = 'None';
            if (data.languages) {
                languages = Object.values(data.languages).join(', ');
            }

            let currencies = 'None';
            if (data.currencies) {
                currencies = Object.values(data.currencies).map(c => `${c.name} (${c.symbol})`).join(', ');
            }

            const embed = new EmbedBuilder()
                .setColor(0x3498DB) // Blue
                .setTitle(`${data.name.common} ${data.flag}`)
                .setThumbnail(data.flags.png)
                .addFields(
                    { name: 'Official Name', value: data.name.official || 'N/A', inline: false },
                    { name: 'Capital', value: data.capital ? data.capital[0] : 'N/A', inline: true },
                    { name: 'Region', value: `${data.region} (${data.subregion || 'N/A'})`, inline: true },
                    { name: 'Population', value: data.population.toLocaleString(), inline: true },
                    { name: 'Languages', value: languages, inline: true },
                    { name: 'Currencies', value: currencies, inline: true },
                    { name: 'Independent', value: data.independent ? 'Yes' : 'No', inline: true }
                )
                .setFooter({ text: 'Powered by REST Countries API' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Country API Error:', error);
            await interaction.editReply({ content: `Could not find a country named **${name}**.` });
        }
    }
};
