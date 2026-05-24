const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Search the Pokédex for information on any Pokémon.')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The name of the Pokémon')
                .setRequired(true)
        ),
    async execute(interaction) {
        const pokemonName = interaction.options.getString('name').toLowerCase();
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`);
            const data = response.data;

            const types = data.types.map(t => t.type.name).join(', ');
            const abilities = data.abilities.map(a => a.ability.name).join(', ');
            
            // Format stats
            let stats = '';
            for (const stat of data.stats) {
                stats += `**${stat.stat.name.toUpperCase()}**: ${stat.base_stat}\n`;
            }

            const embed = new EmbedBuilder()
                .setColor(0xEE1515) // Pokeball Red
                .setTitle(`Pokédex: #${data.id} ${data.name.toUpperCase()}`)
                .setThumbnail(data.sprites.front_default)
                .addFields(
                    { name: 'Types', value: types || 'None', inline: true },
                    { name: 'Height', value: `${data.height / 10}m`, inline: true },
                    { name: 'Weight', value: `${data.weight / 10}kg`, inline: true },
                    { name: 'Abilities', value: abilities || 'None', inline: false },
                    { name: 'Base Stats', value: stats, inline: false }
                )
                .setFooter({ text: 'Powered by PokéAPI' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await interaction.editReply({ content: `Could not find a Pokémon named **${pokemonName}**.` });
            } else {
                console.error('PokéAPI Error:', error);
                await interaction.editReply({ content: 'An error occurred while communicating with the Pokédex.' });
            }
        }
    }
};
