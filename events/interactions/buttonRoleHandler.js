const { Events } = require('discord.js');
const ButtonRolePanel = require('../../schemas/ButtonRolePanel');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('btnrole_')) return;

        // Custom ID format: btnrole_panelId_buttonIndex
        const parts = interaction.customId.split('_');
        const panelId = parts[1];
        const buttonIndex = parts[2];

        try {
            const panel = await ButtonRolePanel.findById(panelId);
            if (!panel) {
                return interaction.reply({ content: 'This button panel is no longer active.', ephemeral: true });
            }

            const buttonConfig = panel.buttons[parseInt(buttonIndex)];
            if (!buttonConfig) {
                return interaction.reply({ content: 'Button configuration not found.', ephemeral: true });
            }

            const roleId = buttonConfig.roleId;
            const role = interaction.guild.roles.cache.get(roleId);
            if (!role) {
                return interaction.reply({ content: 'The assigned role no longer exists in this server.', ephemeral: true });
            }

            const member = interaction.member;
            if (member.roles.cache.has(roleId)) {
                await member.roles.remove(roleId);
                return interaction.reply({ content: `Removed the **${role.name}** role.`, ephemeral: true });
            } else {
                await member.roles.add(roleId);
                return interaction.reply({ content: `Given you the **${role.name}** role.`, ephemeral: true });
            }
        } catch (error) {
            console.error('Error handling button role:', error);
            return interaction.reply({ content: 'Failed to manage your role. Ensure the bot has higher permissions than the role you are trying to get.', ephemeral: true });
        }
    }
};
