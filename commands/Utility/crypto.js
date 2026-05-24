const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('Get current cryptocurrency prices (BTC, ETH, etc).')
        .addStringOption(option => 
            option.setName('coin')
                .setDescription('Coin ID (e.g. bitcoin, ethereum, dogecoin)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const coin = interaction.options.getString('coin').toLowerCase();
        await interaction.deferReply();

        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=usd&include_24hr_change=true`);
            const data = response.data;

            if (!data[coin]) {
                return interaction.editReply({ content: `Could not find data for **${coin}**. Make sure to use the full coin ID (e.g., 'bitcoin' not 'btc').` });
            }

            const price = data[coin].usd;
            const change = data[coin].usd_24h_change;
            
            const isPositive = change >= 0;
            const color = isPositive ? 0x2ecc71 : 0xe74c3c;
            const emoji = isPositive ? '📈' : '📉';

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`Crypto Price: ${coin.charAt(0).toUpperCase() + coin.slice(1)}`)
                .addFields(
                    { name: 'Current Price', value: `$${price.toLocaleString()}`, inline: true },
                    { name: '24h Change', value: `${emoji} ${change.toFixed(2)}%`, inline: true }
                )
                .setFooter({ text: 'Powered by CoinGecko' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('CoinGecko API Error:', error);
            await interaction.editReply({ content: 'Failed to fetch cryptocurrency data.' });
        }
    }
};
