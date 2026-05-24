const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ftoc')
        .setDescription('Converts degrees Fahrenheit into Celsius.')
        .addNumberOption(option => 
            option.setName('fahrenheit')
                .setDescription('The temperature in Fahrenheit')
                .setRequired(true)
        ),
    async execute(interaction) {
        const f = interaction.options.getNumber('fahrenheit');
        
        const c = (f - 32) * 5/9;

        await interaction.reply({ content: `🌡️ **${f}°F** is exactly **${c.toFixed(2)}°C**.` });
    }
};
