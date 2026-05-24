const { SlashCommandBuilder } = require('discord.js');
const User = require('../../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward of 500 coins!'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            if (!userData) {
                userData = new User({ userId: interaction.user.id, guildId: interaction.guild.id });
            }

            const dailyAmount = 500;
            const now = new Date();

            if (userData.dailyClaimedAt) {
                const timeDiff = now.getTime() - userData.dailyClaimedAt.getTime();
                const hoursDiff = timeDiff / (1000 * 3600);

                if (hoursDiff < 24) {
                    const hoursLeft = Math.ceil(24 - hoursDiff);
                    return interaction.editReply(`You have already claimed your daily reward. Come back in ${hoursLeft} hours!`);
                }
            }

            userData.wallet += dailyAmount;
            userData.dailyClaimedAt = now;
            await userData.save();

            await interaction.editReply(`✅ You have successfully claimed your daily reward of **${dailyAmount} coins**!`);
        } catch (error) {
            console.error('Error in /daily command:', error);
            await interaction.editReply('There was an error trying to claim your daily reward.');
        }
    },
};
