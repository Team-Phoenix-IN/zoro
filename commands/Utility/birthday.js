const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Birthday = require('../../schemas/Birthday');
const GuildConfig = require('../../schemas/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Birthday system commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set your birthday')
                .addIntegerOption(option => 
                    option.setName('month')
                        .setDescription('Month (1-12)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(12)
                )
                .addIntegerOption(option => 
                    option.setName('day')
                        .setDescription('Day (1-31)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(31)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View a user\'s birthday')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to check')
                        .setRequired(false)
                )
        ),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        if (interaction.options.getSubcommand() === 'set') {
            const month = interaction.options.getInteger('month');
            const day = interaction.options.getInteger('day');

            // Basic validation
            if (month === 2 && day > 29) {
                return interaction.reply({ content: 'Invalid date. February only has 28 or 29 days!', ephemeral: true });
            }
            if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
                return interaction.reply({ content: 'Invalid date. That month only has 30 days.', ephemeral: true });
            }

            try {
                // Upsert the birthday
                await Birthday.findOneAndUpdate(
                    { guildId, userId: interaction.user.id },
                    { month, day },
                    { upsert: true, new: true }
                );

                interaction.reply({ content: `Your birthday has been successfully set to **${month}/${day}**!`, ephemeral: true });
            } catch (err) {
                console.error('Error setting birthday:', err);
                interaction.reply({ content: 'There was an error saving your birthday.', ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === 'view') {
            const user = interaction.options.getUser('user') || interaction.user;
            
            const bday = await Birthday.findOne({ guildId, userId: user.id });
            if (!bday) {
                return interaction.reply({ content: `${user.username} hasn't set their birthday yet.`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(0xf1c40f)
                .setAuthor({ name: `${user.username}'s Birthday`, iconURL: user.displayAvatarURL() })
                .setDescription(`🎂 **${bday.month}/${bday.day}**`);

            interaction.reply({ embeds: [embed] });
        }
    }
};
