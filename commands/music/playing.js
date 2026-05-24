const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playing')
        .setDescription('View the currently playing song.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const song = queue.songs[0];
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('🎶 Currently Playing')
            .setDescription(`**[${song.name}](${song.url})**\n\nRequested by: ${song.user}\nDuration: \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``)
            .setThumbnail(song.thumbnail);

        await interaction.reply({ embeds: [embed] });
    },
};
