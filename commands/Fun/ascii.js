const { SlashCommandBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Convert text to ASCII art.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to convert (max 20 characters)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');

        if (text.length > 20) {
            return interaction.reply({ content: 'Please provide text under 20 characters so it fits on screen!', ephemeral: true });
        }

        figlet(text, function(err, data) {
            if (err) {
                console.error('Figlet error:', err);
                return interaction.reply({ content: 'Something went wrong rendering the ASCII art.', ephemeral: true });
            }

            // Wrapping the output in a markdown codeblock so Discord renders spacing correctly
            interaction.reply(`\`\`\`\n${data}\n\`\`\``);
        });
    }
};
