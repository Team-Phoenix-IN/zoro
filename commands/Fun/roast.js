const { SlashCommandBuilder } = require('discord.js');

const roasts = [
    "You're like a cloud. When you disappear, it's a beautiful day.",
    "I'd agree with you, but then we'd both be wrong.",
    "If laughter is the best medicine, your face must be curing the world.",
    "You bring everyone so much joy... when you leave the room.",
    "I'm not saying I hate you, but I would unplug your life support to charge my phone.",
    "Your secrets are always safe with me. I never even listen when you tell me them.",
    "You are the human equivalent of a participation award.",
    "I thought of you today. It reminded me to take out the trash.",
    "You're not stupid; you just have bad luck when thinking.",
    "If ignorance is bliss, you must be the happiest person on earth."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription('Roast a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user you want to roast')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

        // Prevent roasting the bot itself
        if (target.id === interaction.client.user.id) {
            return interaction.reply({ content: `Nice try, <@${interaction.user.id}>, but I'm immune to your roasts!` });
        }

        await interaction.reply({ content: `<@${target.id}>, ${randomRoast}` });
    }
};
