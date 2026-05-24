const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing and clear the queue.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing in the queue right now!', ephemeral: true });
        
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me to stop the music!', ephemeral: true });
        }

        queue.stop();
        await interaction.reply('🛑 | Stopped the music and cleared the queue!');
    },
};
