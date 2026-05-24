const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something.')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message you want the bot to say')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('message');

        // Send the message to the channel
        await interaction.channel.send({ content: text });

        // Reply ephemerally so the command execution is hidden
        await interaction.reply({ content: 'Message sent!', ephemeral: true });
    }
};
