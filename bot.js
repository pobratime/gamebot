// bot.js

const { Telegraf } = require('telegraf');
const BattleshipGame = require('./battleships');

const botToken = '6834768804:AAEncSvNRBXVr_w8uT7g5QwbgEe0Cvaf2Qw';
const bot = new Telegraf(botToken);

const game = new BattleshipGame();
game.init();

let chatId;

bot.command('battleships', (ctx) => {
    game.init();
    chatId = ctx.message.chat.id;
    ctx.reply('Battleship game started! Use /place <row> <col> to place your boats.');
});

bot.command('place', (ctx) => {
    if (game.isPlayerTurn) {
        const args = ctx.message.text.split(' ').slice(1);
        if (args.length === 2) {
            const row = parseInt(args[0], 10);
            const col = parseInt(args[1], 10);

            if (row >= 0 && row < game.dimension && col >= 0 && col < game.dimension) {
                const placed = game.placePlayerBoat(row, col);
                if (placed) {
                    ctx.reply(game.getStatus());
                    if (game.playerBoatsRemaining === 0) {
                        game.botPlaceBoatsRandomly();
                        game.isPlayerTurn = true;
                        ctx.reply('Boats placed. Now use /shoot <row> <col> to make a move.');
                    } else {
                        ctx.reply(`Boat placed at (${row}, ${col}). ${game.playerBoatsRemaining} boats remaining.`);
                    }
                } else {
                    ctx.reply('Cannot place a boat at this position. Try again.');
                }
            } else {
                ctx.reply('Invalid row or column. Use /place <row> <col> to place your boats.');
            }
        } else {
            ctx.reply('Invalid format. Use /place <row> <col> to place your boats.');
        }
    } else {
        ctx.reply('It\'s not your turn. Wait for the bot to finish its move.');
    }
});

bot.command('shoot', (ctx) => {
    if (!game.isPlayerTurn) {
        const args = ctx.message.text.split(' ').slice(1);
        if (args.length === 2) {
            const row = parseInt(args[0], 10);
            const col = parseInt(args[1], 10);

            if (row >= 0 && row < game.dimension && col >= 0 && col < game.dimension) {
                const result = game.makePlayerMove(row, col);
                ctx.reply(result);
                if (result.includes('You win') || result.includes('Game over')) {
                    game.init();
                    ctx.reply('Use /place <row> <col> to start a new game.');
                } else {
                    game.isPlayerTurn = false;
                    ctx.reply('Bot\'s turn. Wait for its move.');
                    setTimeout(() => {
                        const botResult = game.makeBotMove();
                        ctx.reply(botResult);
                        if (botResult.includes('Game over')) {
                            game.init();
                            ctx.reply('Use /place <row> <col> to start a new game.');
                        } else {
                            game.isPlayerTurn = true;
                            ctx.reply('Your turn. Use /shoot <row> <col> to make a move.');
                        }
                    }, 1000);
                }
            } else {
                ctx.reply('Invalid row or column. Use /shoot <row> <col> to make a move.');
            }
        } else {
            ctx.reply('Invalid format. Use /shoot <row> <col> to make a move.');
        }
    } else {
        ctx.reply('It\'s your turn. Use /shoot <row> <col> to make a move.');
    }
});

// Start the bot
bot.launch();
