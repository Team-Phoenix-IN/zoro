const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skip to a specific song in the queue.')
        .addNumberOption(option => option.setName('amount').setDescription('Queue position number').setRequired(true)),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const position = interaction.options.getNumber('amount');
        if (position > queue.songs.length || position < 1) {
            return interaction.reply({ content: '❌ | Invalid queue position!', ephemeral: true });
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me!', ephemeral: true });
        }

        await queue.jump(position - 1);
        await interaction.reply(`⏭️ | Skipped to song **#${position}**!`);
    },
};
