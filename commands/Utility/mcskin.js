const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcskin')
        .setDescription('Get a Minecraft player skin.')
        .addStringOption(option => option.setName('username').setDescription('Minecraft Username').setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const skinUrl = `https://minotar.net/armor/body/${username}/200.png`;

        const embed = new EmbedBuilder()
            .setTitle(`${username}'s Minecraft Skin`)
            .setColor('Blue')
            .setImage(skinUrl);

        await interaction.reply({ embeds: [embed] });
    },
};
