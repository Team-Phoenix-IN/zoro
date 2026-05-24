const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ShopItem = require('../../schemas/ShopItem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('View the economy role shop.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        
        const items = await ShopItem.find({ guildId });
        
        if (!items || items.length === 0) {
            return interaction.reply({ content: 'The shop is currently empty.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xf1c40f)
            .setTitle(`${interaction.guild.name} Economy Shop`)
            .setDescription('Use `/buy <item_name>` to purchase a role!')
            .setThumbnail(interaction.guild.iconURL());

        for (const item of items) {
            const role = interaction.guild.roles.cache.get(item.roleId);
            const roleName = role ? role.name : 'Unknown Role';
            embed.addFields({
                name: `${item.name} — 🪙 ${item.price}`,
                value: `**Description:** ${item.description}\n**Gives Role:** @${roleName}`
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
};
