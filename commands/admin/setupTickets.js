const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Sends the ticket creation panel to the current channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const config = await GuildConfig.findOne({ guildId });

        if (!config || !config.ticketCategoryId) {
            return interaction.reply({ 
                content: 'Ticket system is not fully configured. Please set a **Ticket Category ID** in the web dashboard first.', 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle('Support Tickets')
            .setDescription('Need help? Click the button below to open a private support ticket with our staff team.')
            .setFooter({ text: 'Support Team' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_create')
                    .setLabel('Create Ticket')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Ticket panel has been setup in this channel!', ephemeral: true });
    }
};
