const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const animals = [
    "A deeply confused pigeon.",
    "A majestic bald eagle.",
    "A sleepy sloth.",
    "A very angry chihuahua.",
    "A highly intelligent dolphin.",
    "A trash-loving raccoon.",
    "A graceful swan.",
    "A clumsy potato bug.",
    "A fierce honey badger.",
    "A screaming goat.",
    "A potato."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spiritanimal')
        .setDescription('Randomly assigns you a funny spirit animal.'),
    async execute(interaction) {
        const animal = animals[Math.floor(Math.random() * animals.length)];

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('🦊 Spirit Animal')
            .setDescription(`${interaction.user}, your spirit animal is:\n\n**${animal}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
