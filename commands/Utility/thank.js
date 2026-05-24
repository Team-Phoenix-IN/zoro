const { SlashCommandBuilder } = require('discord.js');
const Reputation = require('../../schemas/Reputation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thank')
        .setDescription('Thank a user to give them a reputation point.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to thank')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const guildId = interaction.guild.id;
        const targetId = user.id;
        const authorId = interaction.user.id;

        if (user.bot) {
            return interaction.reply({ content: 'You cannot thank bots.', ephemeral: true });
        }
        if (targetId === authorId) {
            return interaction.reply({ content: 'You cannot thank yourself.', ephemeral: true });
        }

        try {
            // Check cooldown for the author thanking this specific user
            // In a more complex system, we'd have a separate schema just for cooldowns/history
            // For now, we just give the rep point directly to the target.
            
            const targetRep = await Reputation.findOneAndUpdate(
                { guildId, userId: targetId },
                { $inc: { rep: 1 } },
                { upsert: true, new: true }
            );

            interaction.reply({ 
                content: `💖 You thanked **${user.username}**! They now have **${targetRep.rep}** reputation points.` 
            });
        } catch (error) {
            console.error('Error in thank command:', error);
            interaction.reply({ content: 'Failed to thank the user.', ephemeral: true });
        }
    }
};
