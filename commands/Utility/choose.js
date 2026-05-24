const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Provide a comma-separated list of options, and the bot will randomly choose one.')
        .addStringOption(option => 
            option.setName('options')
                .setDescription('Comma-separated options (e.g. Pizza, Burgers, Tacos)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('options');
        const choices = text.split(',').map(c => c.trim()).filter(c => c.length > 0);

        if (choices.length < 2) {
            return interaction.reply({ content: 'Please provide at least 2 valid options separated by a comma.', ephemeral: true });
        }

        const choice = choices[Math.floor(Math.random() * choices.length)];

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🤔 I choose...')
            .setDescription(`**${choice}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
