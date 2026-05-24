const { SlashCommandBuilder } = require('discord.js');
const AFK = require('../../schemas/AFK');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set your AFK status.')
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason you are AFK')
                .setRequired(false)
        ),
    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'AFK';
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        try {
            await AFK.findOneAndUpdate(
                { guildId, userId },
                { reason, timestamp: new Date() },
                { upsert: true, new: true }
            );

            // Optionally modify user nickname if bot has permissions
            try {
                if (interaction.member.manageable && !interaction.member.nickname?.startsWith('[AFK]')) {
                    await interaction.member.setNickname(`[AFK] ${interaction.member.displayName}`);
                }
            } catch (e) {
                // Ignore if missing permissions
            }

            interaction.reply({ content: `You are now AFK: **${reason}**`, ephemeral: false });
        } catch (error) {
            console.error('Error setting AFK:', error);
            interaction.reply({ content: 'Failed to set AFK status.', ephemeral: true });
        }
    }
};
