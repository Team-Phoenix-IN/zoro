const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion for the server.')
        .addStringOption(option => 
            option.setName('idea')
                .setDescription('The suggestion you want to submit')
                .setRequired(true)
        ),
    async execute(interaction) {
        const idea = interaction.options.getString('idea');
        const guildId = interaction.guild.id;

        const config = await GuildConfig.findOne({ guildId });
        if (!config || !config.suggestionChannelId) {
            return interaction.reply({ content: 'The suggestion system is not set up on this server.', ephemeral: true });
        }

        const channel = interaction.guild.channels.cache.get(config.suggestionChannelId);
        if (!channel) {
            return interaction.reply({ content: 'The configured suggestion channel could not be found.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setAuthor({ name: `${interaction.user.tag} suggests:`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(idea)
            .setFooter({ text: 'Status: Pending' })
            .setTimestamp();

        try {
            const message = await channel.send({ embeds: [embed] });
            await message.react('👍');
            await message.react('👎');
            await interaction.reply({ content: `Your suggestion has been submitted in <#${channel.id}>!`, ephemeral: true });
        } catch (error) {
            console.error('Failed to send suggestion:', error);
            await interaction.reply({ content: 'Failed to submit suggestion. Please ensure the bot has permissions in that channel.', ephemeral: true });
        }
    }
};
