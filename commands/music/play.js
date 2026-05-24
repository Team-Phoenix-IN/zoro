const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube, Spotify, or Soundcloud.')
        .addStringOption(option => option.setName('query').setDescription('Song name or URL').setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: '❌ | You must be in a voice channel to use this command!', ephemeral: true });
        }

        const botVoiceChannel = interaction.guild.members.me.voice.channel;
        if (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id) {
            return interaction.reply({ content: '❌ | I am already playing music in another voice channel!', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            await interaction.client.distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member,
            });
            await interaction.editReply({ content: `🔍 | Searching and playing: **${query}**` });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ | An error occurred while trying to play the song.' });
        }
    },
};
