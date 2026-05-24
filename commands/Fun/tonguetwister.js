const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const twisters = [
    "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where's the peck of pickled peppers Peter Piper picked?",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood.",
    "She sells seashells by the seashore. The shells she sells are seashells, I'm sure. So if she sells seashells on the seashore, then I'm sure she sells seashore shells.",
    "I saw Susie sitting in a shoeshine shop. Where she sits she shines, and where she shines she sits.",
    "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn't fuzzy, was he?",
    "Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter.",
    "Can you can a can as a canner can can a can?",
    "I thought a thought. But the thought I thought wasn't the thought I thought I thought. If the thought I thought I thought had been the thought I thought, I wouldn't have thought so much."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tonguetwister')
        .setDescription('Gives you a difficult tongue twister. Try saying it 5 times fast!'),
    async execute(interaction) {
        const twister = twisters[Math.floor(Math.random() * twisters.length)];

        const embed = new EmbedBuilder()
            .setColor(0x16A085)
            .setTitle('👅 Tongue Twister')
            .setDescription(`**${twister}**`)
            .setFooter({ text: 'Try saying it 5 times fast in voice chat!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
