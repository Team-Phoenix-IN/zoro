const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loop the current song or queue.')
        .addStringOption(option => option.setName('mode').setDescription('Loop mode').setRequired(true).addChoices(
            { name: 'Off', value: '0' },
            { name: 'Song', value: '1' },
            { name: 'Queue', value: '2' }
        )),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const mode = parseInt(interaction.options.getString('mode'));

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me!', ephemeral: true });
        }

        modeStr = mode === 0 ? 'Off' : mode === 1 ? 'Song' : 'Queue';
        queue.setRepeatMode(mode);
        await interaction.reply(`🔁 | Set loop mode to **${modeStr}**!`);
    },
};
