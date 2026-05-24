const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume paused music.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing in the queue right now!', ephemeral: true });

        if (!queue.paused) {
            return interaction.reply({ content: '⚠️ | The queue is already playing!', ephemeral: true });
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me to resume!', ephemeral: true });
        }

        queue.resume();
        await interaction.reply('▶️ | Resumed the music!');
    },
};
