const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../../schemas/Ticket');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
        
        const guildId = interaction.guild.id;
        
        if (interaction.customId === 'ticket_create') {
            await interaction.deferReply({ ephemeral: true });
            
            const config = await GuildConfig.findOne({ guildId });
            if (!config || !config.ticketCategoryId) {
                return interaction.editReply('Tickets are not configured correctly. Missing category ID in the dashboard.');
            }
            
            // Check if user already has an open ticket
            const existingTicket = await Ticket.findOne({ guildId, creatorId: interaction.user.id, status: 'open' });
            if (existingTicket) {
                return interaction.editReply(`You already have an open ticket: <#${existingTicket.channelId}>`);
            }
            
            // Permissions setup
            const permissionOverwrites = [
                {
                    id: interaction.guild.id, // @everyone
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id, // Ticket creator
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                }
            ];
            
            if (config.ticketSupportRoleId) {
                permissionOverwrites.push({
                    id: config.ticketSupportRoleId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                });
            }
            
            try {
                // Create the channel
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: config.ticketCategoryId,
                    permissionOverwrites: permissionOverwrites
                });
                
                // Save to DB
                await Ticket.create({
                    guildId,
                    channelId: channel.id,
                    creatorId: interaction.user.id,
                });
                
                // Send welcome message in ticket
                const embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle('Support Ticket')
                    .setDescription(`Welcome <@${interaction.user.id}>! Please describe your issue and our staff will be with you shortly.`)
                    .setTimestamp();
                    
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ticket_close')
                            .setLabel('Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('🔒')
                    );
                    
                await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });
                
                return interaction.editReply(`Your ticket has been created: <#${channel.id}>`);
            } catch (err) {
                console.error(err);
                return interaction.editReply('Failed to create ticket channel. Ensure the bot has correct permissions and the category ID is valid.');
            }
        }
        
        if (interaction.customId === 'ticket_close') {
            await interaction.deferReply();
            
            const ticket = await Ticket.findOne({ channelId: interaction.channel.id, status: 'open' });
            if (!ticket) return interaction.editReply('This channel is not an open ticket.');
            
            // Mark as closed
            ticket.status = 'closed';
            await ticket.save();
            
            // Deny user access to the channel
            await interaction.channel.permissionOverwrites.edit(ticket.creatorId, {
                ViewChannel: false
            });
            
            const embed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle('Ticket Closed')
                .setDescription(`This ticket was closed by <@${interaction.user.id}>.`);
                
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ticket_delete')
                        .setLabel('Delete Ticket')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🗑️')
                );
                
            await interaction.editReply({ embeds: [embed], components: [row] });
        }
        
        if (interaction.customId === 'ticket_delete') {
            const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
            if (!ticket) return interaction.reply({ content: 'Not a ticket channel.', ephemeral: true });
            
            await interaction.reply('Deleting ticket in 5 seconds...');
            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                } catch(err) {
                    console.error('Failed to delete ticket channel:', err);
                }
            }, 5000);
        }
    });
};
