const { DisTube } = require('distube');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { YouTubePlugin } = require('@distube/youtube');

const { SoundCloudPlugin } = require('@distube/soundcloud');

module.exports = (client) => {
    // Initialize DisTube on the client
    client.distube = new DisTube(client, {
        emitNewSongOnly: true,
        plugins: [
            new SoundCloudPlugin(),
            new YouTubePlugin({
                ytdlOptions: {
                    quality: 'highestaudio',
                    highWaterMark: 1 << 25
                }
            })
        ]
    });

    // Event Listeners for Music Events
    client.distube
        .on('playSong', (queue, song) => {
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🎶 Now Playing')
                .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.displayAvatarURL() });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music_playpause')
                        .setLabel('⏯️ Play/Pause')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('music_backward')
                        .setLabel('⏪ -10s')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music_forward')
                        .setLabel('⏩ +10s')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music_skip')
                        .setLabel('⏭️ Skip')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music_stop')
                        .setLabel('⏹️ Disconnect')
                        .setStyle(ButtonStyle.Danger)
                );

            queue.textChannel.send({ embeds: [embed], components: [row] });
        })
        .on('addSong', (queue, song) => {
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('➕ Added to Queue')
                .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Requested by ${song.user.username}`, iconURL: song.user.displayAvatarURL() });

            queue.textChannel.send({ embeds: [embed] });
        })
        .on('addList', (queue, playlist) => {
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('📋 Playlist Added to Queue')
                .setDescription(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue!`);

            queue.textChannel.send({ embeds: [embed] });
        })
        .on('error', (error, queue, song) => {
            console.error('DisTube Error:', error);
            if (queue && queue.textChannel) {
                queue.textChannel.send(`❌ | An error encountered: ${error.toString().slice(0, 1974)}`).catch(console.error);
            }
        })
        .on('empty', queue => queue.textChannel.send('Voice channel is empty! Leaving the channel...'))
        .on('searchNoResult', (message, query) =>
            message.channel.send(`❌ | No result found for \`${query}\`!`)
        )
        .on('finish', queue => queue.textChannel.send('🏁 | Queue finished!'));
    
    console.log('✅ Music Handler (DisTube) initialized.');
};
