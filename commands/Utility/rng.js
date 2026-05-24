const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rng')
        .setDescription('Generates a random number between your Min and Max values.')
        .addIntegerOption(option => 
            option.setName('min')
                .setDescription('The minimum number')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('max')
                .setDescription('The maximum number')
                .setRequired(true)
        ),
    async execute(interaction) {
        const min = interaction.options.getInteger('min');
        const max = interaction.options.getInteger('max');

        if (min >= max) {
            return interaction.reply({ content: 'The minimum number must be strictly less than the maximum number.', ephemeral: true });
        }

        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

        const embed = new EmbedBuilder()
            .setColor(0x1ABC9C)
            .setTitle('🎲 Random Number Generator')
            .setDescription(`You rolled a **${randomNum}**!`)
            .setFooter({ text: `Range: ${min} to ${max}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
