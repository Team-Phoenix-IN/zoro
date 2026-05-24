const { SlashCommandBuilder } = require('discord.js');
const UserProfile = require('../../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Transfer coins to another user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to pay')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Amount of coins to transfer')
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const guildId = interaction.guild.id;

        if (targetUser.bot) {
            return interaction.reply({ content: 'You cannot pay bots.', ephemeral: true });
        }
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot pay yourself.', ephemeral: true });
        }

        try {
            // Get sender profile
            let senderProfile = await UserProfile.findOne({ userId: interaction.user.id, guildId });
            if (!senderProfile || senderProfile.wallet < amount) {
                const bal = senderProfile ? senderProfile.wallet : 0;
                return interaction.reply({ content: `You don't have enough coins! You only have **🪙 ${bal}**.`, ephemeral: true });
            }

            // Get or create receiver profile
            let receiverProfile = await UserProfile.findOne({ userId: targetUser.id, guildId });
            if (!receiverProfile) {
                receiverProfile = await UserProfile.create({ userId: targetUser.id, guildId, wallet: 0 });
            }

            // Transfer funds
            senderProfile.wallet -= amount;
            receiverProfile.wallet += amount;

            await senderProfile.save();
            await receiverProfile.save();

            interaction.reply({ content: `💸 Successfully transferred **🪙 ${amount}** to **${targetUser.username}**!` });
        } catch (error) {
            console.error('Error in pay command:', error);
            interaction.reply({ content: 'There was an error transferring coins.', ephemeral: true });
        }
    }
};
