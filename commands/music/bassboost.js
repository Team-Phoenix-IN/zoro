const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bassboost')
        .setDescription('Toggle bassboost for music.')
        .addStringOption(option => option.setName('level').setDescription('Bassboost level').setRequired(true).addChoices(
            { name: 'Off', value: 'false' },
            { name: 'Low', value: 'bassboost' },
            { name: 'High', value: 'bassboost_high' }
        )),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) return interaction.reply({ content: '❌ | There is nothing playing right now!', ephemeral: true });

        const level = interaction.options.getString('level');

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ | You must be in the same voice channel as me!', ephemeral: true });
        }

        if (level === 'false') {
            queue.filters.clear();
            await interaction.reply('🔈 | Bassboost **Off**!');
        } else {
            if (queue.filters.has(level)) {
                queue.filters.remove(level);
                await interaction.reply(`🔈 | Bassboost **${level}** removed!`);
            } else {
                queue.filters.add(level);
                await interaction.reply(`🔊 | Bassboost **${level}** enabled!`);
            }
        }
    },
};
