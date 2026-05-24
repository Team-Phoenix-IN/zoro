const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Calculate a mathematical expression.')
        .addStringOption(option => 
            option.setName('expression')
                .setDescription('The math expression to solve (e.g. 2 + 2)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const expr = interaction.options.getString('expression');
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`);
            const result = response.data;

            const embed = new EmbedBuilder()
                .setColor(0x2C3E50)
                .setTitle('🧮 Math Calculator')
                .addFields(
                    { name: 'Expression', value: `\`\`\`\n${expr}\n\`\`\``, inline: false },
                    { name: 'Result', value: `\`\`\`\n${result}\n\`\`\``, inline: false }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Math API Error:', error.message);
            await interaction.editReply({ content: 'Invalid mathematical expression or API error.' });
        }
    }
};
