const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mock')
        .setDescription('cOnVeRtS tExT iNtO mOcKiNg SpOnGeBoB cAsE.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to mock')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const mocked = text.split('').map((char, index) => {
            return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }).join('');

        await interaction.reply({ content: mocked });
    }
};
