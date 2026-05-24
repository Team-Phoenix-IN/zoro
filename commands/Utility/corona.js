const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('corona')
        .setDescription('Get COVID-19 statistics for a country or globally.')
        .addStringOption(option => option.setName('country').setDescription('Country name (leave blank for global)').setRequired(false)),
    async execute(interaction) {
        const country = interaction.options.getString('country');
        const url = country 
            ? `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`
            : `https://disease.sh/v3/covid-19/all`;

        await interaction.deferReply();

        try {
            const response = await axios.get(url);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`COVID-19 Statistics - ${country ? data.country : 'Global'}`)
                .setColor('Blue')
                .addFields(
                    { name: 'Total Cases', value: data.cases.toLocaleString(), inline: true },
                    { name: 'Total Deaths', value: data.deaths.toLocaleString(), inline: true },
                    { name: 'Total Recovered', value: data.recovered.toLocaleString(), inline: true },
                    { name: 'Active Cases', value: data.active.toLocaleString(), inline: true },
                    { name: 'Today Cases', value: `+${data.todayCases.toLocaleString()}`, inline: true },
                    { name: 'Today Deaths', value: `+${data.todayDeaths.toLocaleString()}`, inline: true }
                )
                .setTimestamp();
            
            if (data.countryInfo && data.countryInfo.flag) {
                embed.setThumbnail(data.countryInfo.flag);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply({ content: 'Could not fetch data. Please ensure the country name is valid.' });
        }
    },
};
