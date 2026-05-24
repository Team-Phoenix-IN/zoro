const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fakeperson')
        .setDescription('Generate a highly detailed fake identity.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://randomuser.me/api/');
            const user = response.data.results[0];

            const name = `${user.name.title} ${user.name.first} ${user.name.last}`;
            const location = `${user.location.city}, ${user.location.state}, ${user.location.country}`;
            const dob = new Date(user.dob.date).toLocaleDateString();

            const embed = new EmbedBuilder()
                .setColor(0x2ECC71) // Green
                .setTitle(`Fake Identity: ${name}`)
                .setThumbnail(user.picture.large)
                .addFields(
                    { name: 'Gender', value: user.gender, inline: true },
                    { name: 'Date of Birth', value: `${dob} (Age ${user.dob.age})`, inline: true },
                    { name: 'Location', value: location, inline: false },
                    { name: 'Email', value: user.email, inline: true },
                    { name: 'Phone', value: user.phone, inline: true },
                    { name: 'Username', value: user.login.username, inline: false },
                    { name: 'Password', value: `||${user.login.password}||`, inline: true }
                )
                .setFooter({ text: 'Powered by RandomUser API (All data is strictly fictional)' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('RandomUser API Error:', error);
            await interaction.editReply({ content: 'An error occurred while generating a fake identity.' });
        }
    }
};
