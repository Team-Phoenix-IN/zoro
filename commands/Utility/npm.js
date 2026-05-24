const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('npm')
        .setDescription('Search for an NPM package.')
        .addStringOption(option => 
            option.setName('package')
                .setDescription('The name of the NPM package')
                .setRequired(true)
        ),
    async execute(interaction) {
        const pkg = interaction.options.getString('package').toLowerCase();
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`);
            const data = response.data;

            const latestVersion = data['dist-tags'].latest;
            const latestData = data.versions[latestVersion];

            const embed = new EmbedBuilder()
                .setColor(0xCB3837) // NPM Red
                .setTitle(`📦 NPM: ${data.name}`)
                .setURL(`https://www.npmjs.com/package/${data.name}`)
                .setDescription(data.description || 'No description provided.')
                .addFields(
                    { name: 'Latest Version', value: latestVersion, inline: true },
                    { name: 'License', value: latestData.license || 'Unknown', inline: true },
                    { name: 'Author', value: data.author ? data.author.name : 'Unknown', inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await interaction.editReply({ content: `Could not find any NPM package named **${pkg}**.` });
            } else {
                console.error('NPM API Error:', error);
                await interaction.editReply({ content: 'An error occurred while searching the NPM registry.' });
            }
        }
    }
};
