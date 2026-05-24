const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const idioms = [
    { phrase: "Bite the bullet", meaning: "To endure a painful or difficult situation that is seen as unavoidable." },
    { phrase: "Break the ice", meaning: "To do or say something to relieve tension or get conversation going in a strained situation or when strangers meet." },
    { phrase: "Cost an arm and a leg", meaning: "Be extremely expensive." },
    { phrase: "Hit the nail on the head", meaning: "Find exactly the right answer." },
    { phrase: "Let the cat out of the bag", meaning: "Reveal a secret carelessly or by mistake." },
    { phrase: "Piece of cake", meaning: "Something easily achieved." },
    { phrase: "Spill the beans", meaning: "Reveal secret information unintentionally or indiscreetly." },
    { phrase: "Under the weather", meaning: "Slightly unwell or in low spirits." },
    { phrase: "Burn the midnight oil", meaning: "Read or work late into the night." },
    { phrase: "Jump on the bandwagon", meaning: "Join others in doing something that has become fashionable or popular." }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('idiom')
        .setDescription('Gives you a popular idiom and explains its actual meaning.'),
    async execute(interaction) {
        const idiom = idioms[Math.floor(Math.random() * idioms.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2980B9)
            .setTitle('🗣️ Idiom of the Day')
            .addFields(
                { name: 'Idiom', value: `**${idiom.phrase}**` },
                { name: 'Meaning', value: `*${idiom.meaning}*` }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
