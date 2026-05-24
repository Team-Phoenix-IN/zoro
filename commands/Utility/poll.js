const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll with up to 5 options.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question to ask')
                .setRequired(true)
        )
        .addStringOption(option => option.setName('option1').setDescription('Option 1').setRequired(true))
        .addStringOption(option => option.setName('option2').setDescription('Option 2').setRequired(true))
        .addStringOption(option => option.setName('option3').setDescription('Option 3').setRequired(false))
        .addStringOption(option => option.setName('option4').setDescription('Option 4').setRequired(false))
        .addStringOption(option => option.setName('option5').setDescription('Option 5').setRequired(false)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3'),
            interaction.options.getString('option4'),
            interaction.options.getString('option5'),
        ].filter(opt => opt !== null);

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
        let description = '';

        for (let i = 0; i < options.length; i++) {
            description += `${emojis[i]} ${options[i]}\n\n`;
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setAuthor({ name: '📊 Poll Created' })
            .setTitle(question)
            .setDescription(description)
            .setFooter({ text: `Created by ${interaction.user.tag}` })
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        // Add reactions
        for (let i = 0; i < options.length; i++) {
            await message.react(emojis[i]);
        }
    }
};
