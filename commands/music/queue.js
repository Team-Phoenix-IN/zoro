const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the music queue.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .slice(0, 10)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('🎶 Server Queue')
            .setDescription(`**Currently Playing:**\n${queue.songs[0].name}\n\n**Up Next:**\n${q}`)
            .setFooter({ text: `Total Queue Time: ${queue.formattedDuration} | Shows max 10 songs` });

        await interaction.reply({ embeds: [embed] });
    },
};
