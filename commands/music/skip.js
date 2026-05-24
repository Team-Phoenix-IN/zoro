const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me to skip the music!', ephemeral: true });
        }

        try {
            if (queue.songs.length === 1 && queue.autoplay === false) {
                queue.stop();
                await interaction.reply('⏭️ | Skipped! (Queue finished)');
            } else {
                await queue.skip();
                await interaction.reply('⏭️ | Skipped the current song!');
            }
        } catch (e) {
            await interaction.reply({ content: `❌ | Error: ${e.message}`, ephemeral: true });
        }
    },
};
