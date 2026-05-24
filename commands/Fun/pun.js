const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const puns = [
    "I'm reading a book on anti-gravity. I just can't put it down.",
    "Did you hear about the guy whose whole left side was cut off? He's all right now.",
    "I'd tell you a chemistry joke but I know I wouldn't get a reaction.",
    "I used to be a baker, but I couldn't make enough dough.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call a fake noodle? An impasta.",
    "I don't trust stairs. They're always up to something.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "I'm on a seafood diet. I see food and I eat it.",
    "Why did the bicycle fall over? It was two tired."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pun')
        .setDescription('Tells a random, incredibly cheesy pun.'),
    async execute(interaction) {
        const pun = puns[Math.floor(Math.random() * puns.length)];

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setTitle('🤣 Pun')
            .setDescription(`**${pun}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
