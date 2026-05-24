const { SlashCommandBuilder } = require('discord.js');
const ShopItem = require('../../schemas/ShopItem');
const UserProfile = require('../../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Purchase an item from the economy shop.')
        .addStringOption(option => 
            option.setName('item_name')
                .setDescription('The exact name of the item to buy')
                .setRequired(true)
        ),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const itemName = interaction.options.getString('item_name');

        // Note: Using a case-insensitive regex for convenience
        const item = await ShopItem.findOne({ guildId, name: { $regex: new RegExp(`^${itemName}$`, 'i') } });
        
        if (!item) {
            return interaction.reply({ content: 'Could not find an item with that name in the shop.', ephemeral: true });
        }

        const role = interaction.guild.roles.cache.get(item.roleId);
        if (!role) {
            return interaction.reply({ content: 'The role tied to this item no longer exists. Please contact an admin.', ephemeral: true });
        }

        if (interaction.member.roles.cache.has(role.id)) {
            return interaction.reply({ content: 'You already own this role!', ephemeral: true });
        }

        // Check user balance
        let userProfile = await UserProfile.findOne({ userId: interaction.user.id, guildId });
        if (!userProfile || userProfile.wallet < item.price) {
            const currentBal = userProfile ? userProfile.wallet : 0;
            return interaction.reply({ content: `You don't have enough coins! This item costs **🪙 ${item.price}**, but you only have **🪙 ${currentBal}**.`, ephemeral: true });
        }

        try {
            // Deduct coins and save
            userProfile.wallet -= item.price;
            await userProfile.save();

            // Give the role
            await interaction.member.roles.add(role.id);

            return interaction.reply({ content: `🎉 Successfully purchased **${item.name}** for 🪙 ${item.price}! You have been given the **${role.name}** role.` });
        } catch (error) {
            console.error('Error buying item:', error);
            // Refund coins if role addition failed (basic fallback)
            userProfile.wallet += item.price;
            await userProfile.save();
            return interaction.reply({ content: 'Failed to assign the role. Please ensure the bot has a higher role than the one you are trying to buy.', ephemeral: true });
        }
    }
};
