const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue.')
        .addNumberOption(option => option.setName('amount').setDescription('Queue position number').setRequired(true)),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const position = interaction.options.getNumber('amount');
        if (position >= queue.songs.length || position < 1) {
            return interaction.reply({ content: '❌ | Invalid queue position! Note: You cannot remove the currently playing song (0).', ephemeral: true });
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me!', ephemeral: true });
        }

        const song = queue.songs[position];
        queue.songs.splice(position, 1);
        await interaction.reply(`🗑️ | Removed **${song.name}** from the queue!`);
    },
};
