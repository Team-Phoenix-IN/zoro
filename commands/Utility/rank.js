const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Level = require('../../schemas/Level');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Shows your current level and XP')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to check the rank for')
                .setRequired(false)
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const guildId = interaction.guild.id;

        const config = await GuildConfig.findOne({ guildId });
        if (!config || !config.levelingEnabled) {
            return interaction.reply({ content: 'The leveling system is currently disabled on this server.', ephemeral: true });
        }

        const userLevel = await Level.findOne({ guildId, userId: targetUser.id });
        if (!userLevel) {
            return interaction.reply({ content: `${targetUser.username} currently has no XP.`, ephemeral: true });
        }

        const nextLevelXp = 5 * Math.pow(userLevel.level, 2) + 50 * userLevel.level + 100;
        
        // Find leaderboard rank
        const allLevels = await Level.find({ guildId }).sort({ level: -1, xp: -1 });
        const rankIndex = allLevels.findIndex(l => l.userId === targetUser.id);
        const rank = rankIndex !== -1 ? rankIndex + 1 : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setAuthor({ name: `${targetUser.username}'s Rank`, iconURL: targetUser.displayAvatarURL() })
            .addFields(
                { name: 'Rank', value: `#${rank}`, inline: true },
                { name: 'Level', value: `${userLevel.level}`, inline: true },
                { name: 'XP', value: `${userLevel.xp} / ${nextLevelXp}`, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
