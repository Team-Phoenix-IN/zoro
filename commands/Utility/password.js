const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('password')
        .setDescription('Generates a secure, random password and sends it to your DMs.')
        .addIntegerOption(option => 
            option.setName('length')
                .setDescription('Length of the password (default 12, max 32)')
                .setRequired(false)
                .setMinValue(6)
                .setMaxValue(32)
        ),
    async execute(interaction) {
        const length = interaction.options.getInteger('length') || 12;
        
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }

        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setTitle('🔐 Secure Password Generator')
            .setDescription('Here is your securely generated password:')
            .addFields({ name: 'Password', value: `\`\`\`${password}\`\`\`` })
            .setFooter({ text: 'Keep this safe!' })
            .setTimestamp();

        try {
            await interaction.user.send({ embeds: [embed] });
            // Reply ephemerally in the channel so it's not leaked
            await interaction.reply({ content: '✅ I have securely DM\'d you your new password!', ephemeral: true });
        } catch (error) {
            console.error('Could not send DM to user.', error);
            await interaction.reply({ content: '❌ I could not DM you the password. Please check your privacy settings and ensure you allow direct messages from server members.', ephemeral: true });
        }
    }
};
