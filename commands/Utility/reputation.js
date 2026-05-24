const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Reputation = require('../../schemas/Reputation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reputation')
        .setDescription('Check a user\'s reputation.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to check')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const guildId = interaction.guild.id;

        try {
            const userRep = await Reputation.findOne({ guildId, userId: user.id });
            const repPoints = userRep ? userRep.rep : 0;

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setAuthor({ name: `${user.username}'s Reputation`, iconURL: user.displayAvatarURL() })
                .setDescription(`💖 **${repPoints}** Reputation Points`);

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching reputation:', error);
            interaction.reply({ content: 'Failed to fetch reputation.', ephemeral: true });
        }
    }
};
