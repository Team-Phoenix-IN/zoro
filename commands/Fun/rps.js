const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock, Paper, Scissors with the bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('Rock, Paper, Scissors')
            .setDescription('Choose your weapon below!');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rps_rock')
                    .setLabel('Rock')
                    .setEmoji('🪨')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('rps_paper')
                    .setLabel('Paper')
                    .setEmoji('📄')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('rps_scissors')
                    .setLabel('Scissors')
                    .setEmoji('✂️')
                    .setStyle(ButtonStyle.Primary)
            );

        const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const filter = i => i.user.id === interaction.user.id && i.customId.startsWith('rps_');
        
        try {
            const confirmation = await response.awaitMessageComponent({ filter, time: 30000 });
            
            const userChoice = confirmation.customId.replace('rps_', '');
            const botChoices = ['rock', 'paper', 'scissors'];
            const botChoice = botChoices[Math.floor(Math.random() * botChoices.length)];
            
            const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
            let result = '';
            let color = 0x5865F2;

            if (userChoice === botChoice) {
                result = 'It\'s a tie!';
                color = 0xf1c40f;
            } else if (
                (userChoice === 'rock' && botChoice === 'scissors') ||
                (userChoice === 'paper' && botChoice === 'rock') ||
                (userChoice === 'scissors' && botChoice === 'paper')
            ) {
                result = 'You win! 🎉';
                color = 0x2ecc71;
            } else {
                result = 'You lose! 😢';
                color = 0xe74c3c;
            }

            const resultEmbed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Rock, Paper, Scissors')
                .setDescription(result)
                .addFields(
                    { name: 'You chose', value: emojis[userChoice], inline: true },
                    { name: 'Bot chose', value: emojis[botChoice], inline: true }
                );

            await confirmation.update({ embeds: [resultEmbed], components: [] });
        } catch (e) {
            await interaction.editReply({ content: 'Game timed out.', embeds: [], components: [] });
        }
    }
};
