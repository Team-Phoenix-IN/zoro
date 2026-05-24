const { Events } = require('discord.js');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {

        // ── Slash Commands ──────────────────────────────────────────────────
        if (interaction.isChatInputCommand()) {
            let commandName = interaction.commandName;

            // Handle dynamically grouped subcommands
            const subGroup = interaction.options.getSubcommandGroup(false);
            const subCmd = interaction.options.getSubcommand(false);

            if (subGroup) {
                // The original command had subcommands of its own, so it became a SubcommandGroup
                commandName = subGroup;
            } else if (subCmd) {
                // The original command was a root command, so it became a Subcommand
                commandName = subCmd;
            }

            const command = client.commands.get(commandName);

            if (!command) {
                console.error(`No command matching ${commandName} was found.`);
                return;
            }

            // Check if this command has been disabled by the server admin via dashboard
            try {
                if (interaction.guildId) {
                    const config = await getGuildConfig(interaction.guildId);
                    if (config && config.disabledCommands && config.disabledCommands.includes(commandName)) {
                        return interaction.reply({
                            content: '❌ This command has been **disabled** by a server administrator.',
                            ephemeral: true
                        });
                    }
                }
            } catch (err) {
                // If DB check fails, allow command to run rather than blocking everything
                console.error('Failed to check disabled commands:', err.message);
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(`Error executing ${commandName} (Root: ${interaction.commandName})`);
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }

        // ── Button: Verification ────────────────────────────────────────────
        else if (interaction.isButton() && interaction.customId.startsWith('verify_')) {
            const roleId = interaction.customId.split('_')[1];
            const role = interaction.guild.roles.cache.get(roleId);

            if (!role) {
                return interaction.reply({ content: 'The verified role seems to be missing from the server.', ephemeral: true });
            }

            try {
                await interaction.member.roles.add(role);
                await interaction.reply({ content: '✅ You have been successfully verified and given access to the server!', ephemeral: true });
            } catch (error) {
                console.error('Error assigning verification role:', error);
                await interaction.reply({ content: 'There was an error assigning the verified role. Please contact an administrator.', ephemeral: true });
            }
        }

        // ── Button: Music Controls ────────────────────────────────────────────
        else if (interaction.isButton() && interaction.customId.startsWith('music_')) {
            const queue = client.distube.getQueue(interaction);
            
            if (!queue) {
                return interaction.reply({ content: '❌ | There is no music playing right now!', ephemeral: true });
            }

            const voiceChannel = interaction.member.voice.channel;
            const botVoiceChannel = interaction.guild.members.me.voice.channel;

            if (!voiceChannel || (botVoiceChannel && botVoiceChannel.id !== voiceChannel.id)) {
                return interaction.reply({ content: '❌ | You must be in the same voice channel to control the music!', ephemeral: true });
            }

            try {
                switch (interaction.customId) {
                    case 'music_playpause':
                        if (queue.paused) {
                            queue.resume();
                            await interaction.reply({ content: '▶️ | Resumed the music.', ephemeral: true });
                        } else {
                            queue.pause();
                            await interaction.reply({ content: '⏸️ | Paused the music.', ephemeral: true });
                        }
                        break;
                    case 'music_skip':
                        if (queue.songs.length <= 1 && !queue.autoplay) {
                            queue.stop();
                            await interaction.reply({ content: '⏭️ | Skipped the song. Queue is now empty.', ephemeral: true });
                        } else {
                            await queue.skip();
                            await interaction.reply({ content: '⏭️ | Skipped to the next song.', ephemeral: true });
                        }
                        break;
                    case 'music_backward':
                        const backTime = Math.max(queue.currentTime - 10, 0);
                        queue.seek(backTime);
                        // Send ephemeral reply instantly
                        await interaction.reply({ content: `⏪ | Rewound 10 seconds.`, ephemeral: true });
                        break;
                    case 'music_forward':
                        const forwardTime = Math.min(queue.currentTime + 10, queue.songs[0].duration);
                        queue.seek(forwardTime);
                        await interaction.reply({ content: `⏩ | Fast-forwarded 10 seconds.`, ephemeral: true });
                        break;
                    case 'music_stop':
                        queue.stop();
                        client.distube.voices.leave(interaction.guild);
                        await interaction.reply({ content: '⏹️ | Stopped the music, cleared the queue, and disconnected from the channel.', ephemeral: true });
                        break;
                }
            } catch (error) {
                console.error('Error handling music button:', error);
                if (!interaction.replied) {
                    await interaction.reply({ content: '❌ | An error occurred while trying to process that action.', ephemeral: true });
                }
            }
        }
    },
};
