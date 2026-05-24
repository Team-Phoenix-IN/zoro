const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../../schemas/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View a user\'s warnings.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to check')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        try {
            const warnings = await Warning.find({ guildId, userId: user.id }).sort({ timestamp: -1 });

            if (!warnings.length) {
                return interaction.reply({ content: `${user.username} has no warnings. 🎉`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(0xf1c40f)
                .setAuthor({ name: `${user.username}'s Warnings (${warnings.length})`, iconURL: user.displayAvatarURL() })
                .setDescription(`To delete a warning, use the **ZORO Web Dashboard**.`);

            warnings.forEach((w, index) => {
                // Only show up to 10 warnings to prevent embed size limit
                if (index < 10) {
                    embed.addFields({
                        name: `Warning ${warnings.length - index}`,
                        value: `**Reason:** ${w.reason}\n**Mod:** <@${w.moderatorId}>\n**Date:** <t:${Math.floor(w.timestamp.getTime() / 1000)}:R>`
                    });
                }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching warnings:', error);
            interaction.reply({ content: 'There was an error fetching warnings.', ephemeral: true });
        }
    }
};
