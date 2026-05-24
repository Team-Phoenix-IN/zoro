const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        if (queue.paused) {
            return interaction.reply({ content: '⚠️ | The queue is already paused!', ephemeral: true });
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me to pause!', ephemeral: true });
        }

        queue.pause();
        await interaction.reply('⏸️ | Paused the music!');
    },
};
