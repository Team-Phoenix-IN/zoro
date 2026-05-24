const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Calculate the love percentage between two people.')
        .addUserOption(option => 
            option.setName('user1')
                .setDescription('The first user')
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName('user2')
                .setDescription('The second user (defaults to you)')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2') || interaction.user;

        if (user1.id === user2.id) {
            return interaction.reply({ content: 'You can\'t ship someone with themselves! Self-love is 100% though. ❤️', ephemeral: true });
        }

        const lovePercent = Math.floor(Math.random() * 101);
        const heartScale = Math.floor(lovePercent / 10);
        
        let bar = "";
        for (let i = 0; i < 10; i++) {
            if (i < heartScale) bar += "❤️";
            else bar += "🖤";
        }

        let message = "";
        if (lovePercent < 25) message = "Yikes... not meant to be. 💔";
        else if (lovePercent < 50) message = "Maybe as friends? 🤷";
        else if (lovePercent < 75) message = "There is some tension here! 👀";
        else if (lovePercent < 90) message = "A perfect match! 😍";
        else message = "Get married already! 💍";

        const embed = new EmbedBuilder()
            .setColor(0xFF69B4) // Hot Pink
            .setTitle('Love Meter')
            .setDescription(`**${user1.username}** x **${user2.username}**\n\n**${lovePercent}%**\n${bar}\n\n*${message}*`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
