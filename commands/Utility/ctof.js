const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ctof')
        .setDescription('Converts degrees Celsius into Fahrenheit.')
        .addNumberOption(option => 
            option.setName('celsius')
                .setDescription('The temperature in Celsius')
                .setRequired(true)
        ),
    async execute(interaction) {
        const c = interaction.options.getNumber('celsius');
        
        const f = (c * 9/5) + 32;

        await interaction.reply({ content: `🌡️ **${c}°C** is exactly **${f.toFixed(2)}°F**.` });
    }
};
