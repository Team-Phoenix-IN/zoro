const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Play casino roulette!')
        .addStringOption(option => option.setName('color').setDescription('Red, Black, or Green').setRequired(true).addChoices(
            { name: 'Red (2x)', value: 'red' },
            { name: 'Black (2x)', value: 'black' },
            { name: 'Green (14x)', value: 'green' }
        ))
        .addNumberOption(option => option.setName('amount').setDescription('Amount to bet').setRequired(true)),
    async execute(interaction) {
        const color = interaction.options.getString('color');
        const bet = interaction.options.getNumber('amount');
        if (bet <= 0) return interaction.reply({ content: 'Bet must be greater than 0!', ephemeral: true });

        const userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!userData || userData.wallet < bet) {
            return interaction.reply({ content: 'You do not have enough coins in your wallet!', ephemeral: true });
        }

        // Spin
        const roll = Math.floor(Math.random() * 37); // 0-36
        let resultColor;
        if (roll === 0) resultColor = 'green';
        else if (roll % 2 === 0) resultColor = 'black';
        else resultColor = 'red';

        let winAmount = 0;
        if (color === resultColor) {
            winAmount = color === 'green' ? bet * 14 : bet * 2;
        }

        const netProfit = winAmount > 0 ? winAmount - bet : -bet;
        userData.wallet += netProfit;
        await userData.save();

        const embed = new EmbedBuilder()
            .setTitle('🎡 Roulette')
            .setColor(winAmount > 0 ? 'Green' : 'Red')
            .setDescription(`The wheel landed on **${roll} (${resultColor})**.\n\n` + 
                (winAmount > 0 
                    ? `You won **${winAmount}** coins!` 
                    : `You lost your bet of **${bet}** coins.`))
            .setFooter({ text: `New Balance: ${userData.wallet} coins` });

        await interaction.reply({ embeds: [embed] });
    },
};
