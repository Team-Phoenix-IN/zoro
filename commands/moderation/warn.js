const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Warning = require('../../schemas/Warning');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user for rule violations.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the warning')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const guildId = interaction.guild.id;

        if (user.bot) {
            return interaction.reply({ content: 'You cannot warn bots.', ephemeral: true });
        }
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot warn yourself.', ephemeral: true });
        }

        try {
            await Warning.create({
                guildId,
                userId: user.id,
                moderatorId: interaction.user.id,
                reason
            });

            const embed = new EmbedBuilder()
                .setColor(0xe74c3c)
                .setAuthor({ name: 'User Warned', iconURL: user.displayAvatarURL() })
                .setDescription(`<@${user.id}> has been warned.`)
                .addFields(
                    { name: 'Reason', value: reason },
                    { name: 'Moderator', value: `<@${interaction.user.id}>` }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            // Attempt to DM the user
            try {
                await user.send(`You have been warned in **${interaction.guild.name}** for: ${reason}`);
            } catch (err) {
                // User has DMs off, ignore
            }
        } catch (error) {
            console.error('Error warning user:', error);
            interaction.reply({ content: 'There was an error issuing the warning.', ephemeral: true });
        }
    }
};
