const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows your current coin balance and level.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to check the balance of')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;

        await interaction.deferReply();

        try {
            let userData = await User.findOne({ userId: targetUser.id, guildId: interaction.guild.id });
            if (!userData) {
                userData = { level: 1, xp: 0, wallet: 0 }; // Default display if no entry
            }

            const embed = new EmbedBuilder()
                .setTitle(`${targetUser.username}'s Profile`)
                .setColor('Blue')
                .addFields(
                    { name: '💰 Wallet', value: `${userData.wallet} coins`, inline: true },
                    { name: '🏆 Level', value: `${userData.level}`, inline: true },
                    { name: '✨ XP', value: `${userData.xp} / ${userData.level * 100}`, inline: true }
                )
                .setThumbnail(targetUser.displayAvatarURL());

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in /balance command:', error);
            await interaction.editReply('There was an error fetching the balance.');
        }
    },
};
