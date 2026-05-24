const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shufflewords')
        .setDescription('Scrambles the order of the words in the sentence.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to shuffle')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        
        const words = text.split(/\s+/);
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }
        
        const shuffled = words.join(' ');

        await interaction.reply({ content: `\`\`\`\n${shuffled}\n\`\`\`` });
    }
};
