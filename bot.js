// bot.js

const { Telegraf } = require('telegraf');
const BattleshipGame = require('./battleships');
const icons = require('./icnos');

const botToken = '6834768804:AAEncSvNRBXVr_w8uT7g5QwbgEe0Cvaf2Qw';
const bot = new Telegraf(botToken);

const activeGames = {};

// Command handler for /battleships
bot.command('battleships', (ctx) => {
    const chatId = ctx.message.chat.id;

    // Create a new game instance for the chat
    const game = new BattleshipGame();
    game.startGame();

    // Store the game in the activeGames object
    activeGames[chatId] = game;

    // Display the initial game status
    const initialBoard = game.getStatus().replace(/!/g, '&#33;'); // replace '!' with HTML entity
    ctx.reply(`Starting battleships game!\n${initialBoard}`, { parse_mode: 'HTML' });
});

// Handler for /move command
bot.on('text', (ctx) => {
    const chatId = ctx.message.chat.id;
    const game = activeGames[chatId];

    if (game) {
        const match = ctx.message.text.match(/\/move (\d+) (\d+)/);

        if (match && match.length === 3) {
            const row = parseInt(match[1], 10);
            const col = parseInt(match[2], 10);

            const result = game.makeMove(row, col);

            ctx.reply(result + '\n' + game.getStatus(), { parse_mode: 'MarkdownV2' });

            if (result.includes('You win') || result.includes('Game over')) {
                delete activeGames[chatId];
            }
        } else {
            ctx.reply('Invalid move format. Use /move <row> <col> to make a move.');
        }
    } else {
        ctx.reply('No active game. Start a new game with /battleships.');
    }
});

// Start the bot
bot.launch();
