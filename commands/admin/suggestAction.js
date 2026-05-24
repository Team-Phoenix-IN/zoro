const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest-action')
        .setDescription('Accept or deny a suggestion.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => 
            option.setName('message_id')
                .setDescription('The ID of the suggestion message')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Accept or deny')
                .setRequired(true)
                .addChoices(
                    { name: 'Accept', value: 'accept' },
                    { name: 'Deny', value: 'deny' }
                )
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the action')
                .setRequired(false)
        ),
    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');
        const action = interaction.options.getString('action');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const guildId = interaction.guild.id;

        const config = await GuildConfig.findOne({ guildId });
        if (!config || !config.suggestionChannelId) {
            return interaction.reply({ content: 'The suggestion system is not configured.', ephemeral: true });
        }

        const channel = interaction.guild.channels.cache.get(config.suggestionChannelId);
        if (!channel) return interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });

        try {
            const message = await channel.messages.fetch(messageId);
            if (!message || !message.embeds.length) {
                return interaction.reply({ content: 'Could not find a suggestion embed with that ID.', ephemeral: true });
            }

            const oldEmbed = message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed);

            if (action === 'accept') {
                newEmbed.setColor(0x2ecc71);
                newEmbed.setFooter({ text: `Status: Accepted by ${interaction.user.tag}` });
                newEmbed.addFields({ name: 'Reason', value: reason });
            } else {
                newEmbed.setColor(0xe74c3c);
                newEmbed.setFooter({ text: `Status: Denied by ${interaction.user.tag}` });
                newEmbed.addFields({ name: 'Reason', value: reason });
            }

            await message.edit({ embeds: [newEmbed] });
            // Optionally clear reactions so votes stop
            try { await message.reactions.removeAll(); } catch (e) { /* ignore if no perms */ }

            await interaction.reply({ content: `Suggestion has been marked as ${action}ed.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to update suggestion:', error);
            await interaction.reply({ content: 'Failed to update suggestion. Ensure the message ID is correct.', ephemeral: true });
        }
    }
};
