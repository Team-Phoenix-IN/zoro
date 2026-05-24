const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('iq')
        .setDescription('Calculate a user\'s IQ.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to calculate')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        
        // Generate a random IQ between 1 and 200
        const iq = Math.floor(Math.random() * 200) + 1;

        let comment = '';
        if (iq < 50) comment = 'Are you okay?';
        else if (iq < 90) comment = 'Below average, but trying your best.';
        else if (iq < 110) comment = 'Completely average.';
        else if (iq < 140) comment = 'Above average! Smart cookie.';
        else comment = 'Einstein who? Absolute genius.';

        const embed = new EmbedBuilder()
            .setColor(0x2ECC71) // Green
            .setTitle('IQ Tester')
            .setDescription(`${target}'s IQ is **${iq}**.\n\n*${comment}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
