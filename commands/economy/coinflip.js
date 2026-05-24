const { SlashCommandBuilder } = require('discord.js');
const User = require('../../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Bet an amount of coins on heads or tails.')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Heads or Tails')
                .setRequired(true)
                .addChoices(
                    { name: 'Heads', value: 'heads' },
                    { name: 'Tails', value: 'tails' }
                ))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of coins to bet')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const choice = interaction.options.getString('choice');
        const betAmount = interaction.options.getInteger('amount');

        await interaction.deferReply();

        try {
            let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            
            if (!userData || userData.wallet < betAmount) {
                return interaction.editReply('You do not have enough coins to make that bet.');
            }

            // Deduct the bet amount immediately
            userData.wallet -= betAmount;

            const outcomes = ['heads', 'tails'];
            const result = outcomes[Math.floor(Math.random() * outcomes.length)];

            if (choice === result) {
                // User won
                const winnings = betAmount * 2;
                userData.wallet += winnings;
                await userData.save();
                await interaction.editReply(`The coin landed on **${result}**! 🎉 You won **${winnings} coins**!`);
            } else {
                // User lost
                await userData.save();
                await interaction.editReply(`The coin landed on **${result}**! 💸 You lost your bet of **${betAmount} coins**.`);
            }
        } catch (error) {
            console.error('Error in /coinflip command:', error);
            await interaction.editReply('There was an error processing your bet.');
        }
    },
};
