const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clyde')
        .setDescription('Generate a fake Discord Clyde system message.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text Clyde should say')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const clydeUrl = `https://some-random-api.com/canvas/misc/clyde?text=${encodeURIComponent(text)}`;

        const embed = new EmbedBuilder()
            .setColor(0x5865F2) // Discord Blurple
            .setTitle('Message from Clyde')
            .setImage(clydeUrl)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
