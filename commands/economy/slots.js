const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Spin the slot machine.')
        .addNumberOption(option => option.setName('amount').setDescription('Amount of coins to bet').setRequired(true)),
    async execute(interaction) {
        const bet = interaction.options.getNumber('amount');
        if (bet <= 0) return interaction.reply({ content: 'Bet must be greater than 0!', ephemeral: true });

        const userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!userData || userData.wallet < bet) {
            return interaction.reply({ content: 'You do not have enough coins in your wallet!', ephemeral: true });
        }

        const slots = ['🍎', '🍒', '🍇', '🍋', '🍉', '💎'];
        const result = [
            slots[Math.floor(Math.random() * slots.length)],
            slots[Math.floor(Math.random() * slots.length)],
            slots[Math.floor(Math.random() * slots.length)]
        ];

        let multiplier = 0;
        if (result[0] === result[1] && result[1] === result[2]) {
            multiplier = 5; // Jackpot
        } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
            multiplier = 2; // Minor win
        }

        const winnings = bet * multiplier;
        const netProfit = winnings - bet;

        // Update DB
        userData.wallet += netProfit;
        await userData.save();

        const embed = new EmbedBuilder()
            .setTitle('🎰 Slot Machine 🎰')
            .setColor(multiplier > 0 ? 'Green' : 'Red')
            .setDescription(`**[ ${result.join(' | ')} ]**\n\n` + 
                (multiplier > 0 
                    ? `You won **${winnings}** coins! (Multiplier: ${multiplier}x)` 
                    : `You lost **${bet}** coins.`))
            .setFooter({ text: `New Balance: ${userData.wallet} coins` });

        await interaction.reply({ embeds: [embed] });
    },
};
