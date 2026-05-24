const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const websites = [
    "https://thatsthefinger.com/",
    "https://smashthewalls.com/",
    "https://jacksonpollock.org/",
    "http://endless.horse/",
    "https://pointerpointer.com/",
    "http://www.staggeringbeauty.com/",
    "https://cat-bounce.com/",
    "http://www.everydayim.com/",
    "https://thezen.zone/",
    "https://corgiorgy.com/",
    "https://papertoilet.com/",
    "https://findtheinvisiblecow.com/",
    "http://corndog.io/",
    "https://heeeeeeeey.com/",
    "http://eelslap.com/",
    "http://www.republiquedesmangues.fr/"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uselessweb')
        .setDescription('Gives you a link to a completely useless website.'),
    async execute(interaction) {
        const url = websites[Math.floor(Math.random() * websites.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE67E22) // Orange
            .setTitle('The Useless Web')
            .setDescription(`Behold, a completely useless website:\n\n🔗 ${url}`)
            .setFooter({ text: 'Warning: Some sites may contain flashing lights/audio' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
