const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Challenge a user to a game of Tic Tac Toe.')
        .addUserOption(option => 
            option.setName('opponent')
                .setDescription('The user you want to play against')
                .setRequired(true)
        ),
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        const challenger = interaction.user;

        if (opponent.bot) return interaction.reply({ content: 'You cannot play against a bot!', ephemeral: true });
        if (opponent.id === challenger.id) return interaction.reply({ content: 'You cannot play against yourself!', ephemeral: true });

        const player1 = challenger;
        const player2 = opponent;
        let currentPlayer = player1;

        // Initialize empty board
        const board = Array(9).fill(null);

        const checkWinner = () => {
            const lines = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            for (const [a, b, c] of lines) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }
            if (!board.includes(null)) return 'tie';
            return null;
        };

        const createBoard = (disableAll = false) => {
            const rows = [];
            for (let i = 0; i < 3; i++) {
                const row = new ActionRowBuilder();
                for (let j = 0; j < 3; j++) {
                    const index = i * 3 + j;
                    const value = board[index];
                    let style = ButtonStyle.Secondary;
                    let label = '➖';

                    if (value === 'X') {
                        style = ButtonStyle.Danger;
                        label = '❌';
                    } else if (value === 'O') {
                        style = ButtonStyle.Primary;
                        label = '⭕';
                    }

                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`ttt_${index}`)
                            .setLabel(label)
                            .setStyle(style)
                            .setDisabled(disableAll || value !== null)
                    );
                }
                rows.push(row);
            }
            return rows;
        };

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('Tic Tac Toe')
            .setDescription(`**${player1.username}** (❌) vs **${player2.username}** (⭕)\n\nIt is currently <@${currentPlayer.id}>'s turn!`);

        const response = await interaction.reply({ content: `<@${player2.id}>, you have been challenged!`, embeds: [embed], components: createBoard(), fetchReply: true });

        const filter = i => i.customId.startsWith('ttt_') && [player1.id, player2.id].includes(i.user.id);
        const collector = response.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== currentPlayer.id) {
                return i.reply({ content: 'It is not your turn!', ephemeral: true });
            }

            const index = parseInt(i.customId.split('_')[1]);
            board[index] = currentPlayer.id === player1.id ? 'X' : 'O';

            const winner = checkWinner();

            if (winner) {
                collector.stop('finished');
                let resultText = '';
                let color = 0x5865F2;

                if (winner === 'tie') {
                    resultText = 'The game ended in a tie!';
                    color = 0xf1c40f;
                } else {
                    const winningUser = winner === 'X' ? player1 : player2;
                    resultText = `🎉 **${winningUser.username}** wins the game!`;
                    color = 0x2ecc71;
                }

                const finalEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('Tic Tac Toe - Game Over')
                    .setDescription(resultText);

                await i.update({ content: null, embeds: [finalEmbed], components: createBoard(true) });
            } else {
                // Switch turn
                currentPlayer = currentPlayer.id === player1.id ? player2 : player1;
                
                embed.setDescription(`**${player1.username}** (❌) vs **${player2.username}** (⭕)\n\nIt is currently <@${currentPlayer.id}>'s turn!`);
                
                await i.update({ embeds: [embed], components: createBoard() });
                collector.resetTimer(); // Reset the 60s timer on a valid move
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('Tic Tac Toe - Timed Out')
                    .setDescription(`The game was abandoned because <@${currentPlayer.id}> took too long.`);
                interaction.editReply({ embeds: [timeoutEmbed], components: createBoard(true) });
            }
        });
    }
};
