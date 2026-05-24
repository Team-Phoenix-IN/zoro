const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Change the music volume.')
        .addNumberOption(option => option.setName('amount').setDescription('Volume (1-100)').setRequired(true)),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const volume = interaction.options.getNumber('amount');
        if (volume < 1 || volume > 100) return interaction.reply({ content: '❌ | Please provide a valid volume between 1 and 100!', ephemeral: true });

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me to change the volume!', ephemeral: true });
        }

        queue.setVolume(volume);
        await interaction.reply(`🔊 | Volume set to **${volume}%**!`);
    },
};
