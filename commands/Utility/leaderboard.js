const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Level = require('../../schemas/Level');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the server leveling leaderboard'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        const config = await GuildConfig.findOne({ guildId });
        if (!config || !config.levelingEnabled) {
            return interaction.reply({ content: 'The leveling system is currently disabled on this server.', ephemeral: true });
        }

        const topUsers = await Level.find({ guildId }).sort({ level: -1, xp: -1 }).limit(10);
        
        if (topUsers.length === 0) {
            return interaction.reply({ content: 'No one has gained any XP yet!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xf1c40f)
            .setTitle(`${interaction.guild.name} Leaderboard`)
            .setThumbnail(interaction.guild.iconURL());

        let description = '';
        for (let i = 0; i < topUsers.length; i++) {
            const userLevel = topUsers[i];
            const nextLevelXp = 5 * Math.pow(userLevel.level, 2) + 50 * userLevel.level + 100;
            description += `**${i + 1}.** <@${userLevel.userId}> - Level **${userLevel.level}** (${userLevel.xp}/${nextLevelXp} XP)\n`;
        }

        embed.setDescription(description);

        await interaction.reply({ embeds: [embed] });
    }
};
