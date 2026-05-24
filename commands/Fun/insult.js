const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const insults = [
    "You're the reason they put instructions on shampoo bottles.",
    "If laughter is the best medicine, your face must be curing the world.",
    "You bring everyone so much joy, when you leave the room.",
    "I'd agree with you but then we'd both be wrong.",
    "You have miles to go before you reach mediocre.",
    "I'm not saying I hate you, but I would unplug your life support to charge my phone.",
    "You are like a cloud. When you disappear, it's a beautiful day.",
    "You're proof that evolution can go in reverse.",
    "I would roast you, but my mom told me not to burn trash.",
    "You're not stupid; you just have bad luck when thinking."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insult')
        .setDescription('Drops a funny, PG-13 insult on a targeted user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to insult')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const insult = insults[Math.floor(Math.random() * insults.length)];

        const embed = new EmbedBuilder()
            .setColor(0xE74C3C)
            .setDescription(`Hey ${target}, ${insult}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
