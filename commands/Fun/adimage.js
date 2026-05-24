const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adimage')
        .setDescription('Generate an ad image.')
        .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const avatarUrl = target.displayAvatarURL({ extension: 'png', size: 512 });
        const adUrl = `https://api.popcat.xyz/ad?image=${encodeURIComponent(avatarUrl)}`;

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`${target.username} as an Ad`)
            .setImage(adUrl);

        await interaction.reply({ embeds: [embed] });
    },
};
