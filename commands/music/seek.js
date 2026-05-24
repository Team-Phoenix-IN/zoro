const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the song.')
        .addNumberOption(option => option.setName('seconds').setDescription('Seconds to seek to').setRequired(true)),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const time = interaction.options.getNumber('seconds');

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me!', ephemeral: true });
        }

        queue.seek(time);
        await interaction.reply(`⏩ | Seeked to **${time}s** in the current song!`);
    },
};
