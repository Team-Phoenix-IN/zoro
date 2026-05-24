const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the current weather for a location.')
        .addStringOption(option => 
            option.setName('location')
                .setDescription('The city or location to search for')
                .setRequired(true)
        ),
    async execute(interaction) {
        const location = interaction.options.getString('location');

        weather.find({ search: location, degreeType: 'C' }, function(err, result) {
            if (err) {
                console.error('Weather API Error:', err);
                return interaction.reply({ content: 'An error occurred while fetching the weather.', ephemeral: true });
            }

            if (!result || result.length === 0) {
                return interaction.reply({ content: `Could not find weather results for **${location}**.`, ephemeral: true });
            }

            const current = result[0].current;
            const locationData = result[0].location;

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`Weather for ${current.observationpoint}`)
                .setDescription(`**${current.skytext}**`)
                .setThumbnail(current.imageUrl)
                .addFields(
                    { name: 'Temperature', value: `${current.temperature}°C`, inline: true },
                    { name: 'Feels Like', value: `${current.feelslike}°C`, inline: true },
                    { name: 'Humidity', value: `${current.humidity}%`, inline: true },
                    { name: 'Wind', value: current.winddisplay, inline: true },
                    { name: 'Timezone', value: `UTC${locationData.timezone}`, inline: true }
                )
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        });
    }
};
