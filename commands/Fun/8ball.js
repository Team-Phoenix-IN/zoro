const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball a question.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question you want to ask')
                .setRequired(true)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        
        const responses = [
            "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.",
            "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.",
            "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.",
            "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.",
            "Don't count on it.", "My reply is no.", "My sources say no.", 
            "Outlook not so good.", "Very doubtful."
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];

        // Determine color based on response positivity
        let color = 0xf1c40f; // yellow
        const positive = ["certain", "decidedly", "doubt", "definitely", "rely", "yes", "likely", "good"];
        const negative = ["don't", "no", "not", "doubtful"];
        
        if (positive.some(p => response.toLowerCase().includes(p))) color = 0x2ecc71; // green
        if (negative.some(n => response.toLowerCase().includes(n))) color = 0xe74c3c; // red

        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: '🎱 Magic 8-Ball' })
            .addFields(
                { name: 'Question', value: question },
                { name: 'Answer', value: response }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
