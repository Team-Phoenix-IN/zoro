const { SlashCommandBuilder } = require('discord.js');

const faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwuify')
        .setDescription('Translates standard text into UwU speak.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to uwuify')
                .setRequired(true)
        ),
    async execute(interaction) {
        let text = interaction.options.getString('text');
        
        text = text.replace(/(?:r|l)/g, "w");
        text = text.replace(/(?:R|L)/g, "W");
        text = text.replace(/n([aeiou])/g, 'ny$1');
        text = text.replace(/N([aeiou])/g, 'Ny$1');
        text = text.replace(/N([AEIOU])/g, 'NY$1');
        text = text.replace(/ove/g, "uv");
        
        const face = faces[Math.floor(Math.random() * faces.length)];
        
        await interaction.reply({ content: `${text} ${face}` });
    }
};
