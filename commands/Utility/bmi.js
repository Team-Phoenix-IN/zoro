const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bmi')
        .setDescription('Calculate your Body Mass Index (BMI).')
        .addNumberOption(option => 
            option.setName('weight')
                .setDescription('Your weight in kilograms (kg)')
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName('height')
                .setDescription('Your height in centimeters (cm)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const weight = interaction.options.getNumber('weight');
        const height = interaction.options.getNumber('height');

        if (height <= 0 || weight <= 0) {
            return interaction.reply({ content: 'Height and weight must be positive numbers.', ephemeral: true });
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 18.5 && bmi < 24.9) category = 'Normal weight';
        else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
        else category = 'Obesity';

        const embed = new EmbedBuilder()
            .setColor(0x1ABC9C)
            .setTitle('⚖️ BMI Calculator')
            .addFields(
                { name: 'Your BMI', value: `**${bmi.toFixed(2)}**`, inline: true },
                { name: 'Category', value: `**${category}**`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
