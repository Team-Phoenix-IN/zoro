const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ppsize')
        .setDescription('The 100% accurate PP size generator.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to check')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        // Generate a random size between 1 and 15
        const size = Math.floor(Math.random() * 15) + 1;
        
        let shaft = "";
        for (let i = 0; i < size; i++) {
            shaft += "=";
        }

        const pp = `8${shaft}D`;

        const embed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('PP Size Machine')
            .setDescription(`${target}'s PP size:\n\n**${pp}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
