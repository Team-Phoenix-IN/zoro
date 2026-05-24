const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shipname')
        .setDescription('Generates a "Ship Name" by merging two usernames together.')
        .addUserOption(option => option.setName('user1').setDescription('First user').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('Second user').setRequired(true)),
    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        const name1 = user1.username;
        const name2 = user2.username;

        const shipName = name1.substring(0, Math.floor(name1.length / 2)) + name2.substring(Math.floor(name2.length / 2));

        const embed = new EmbedBuilder()
            .setColor(0xFF69B4) // Hot pink
            .setTitle('💞 Ship Name Generator')
            .setDescription(`**${name1}** + **${name2}**\n\n💘 Your ship name is: **${shipName}**!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
