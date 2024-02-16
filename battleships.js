// battleships.js

const icons = require('./icnos');

class BattleshipGame {
    constructor() {
        this.dimension = 10;
        this.board = [];
        this.boat = icons.boat;
        this.empty = icons.empty;
        this.destroyed = icons.destroyed;
        this.unknown = icons.unknown;
        this.ships = 5; // Number of ships in the game
        this.shipsRemaining = this.ships;
    }

    startGame() {
        for (let i = 0; i < this.dimension; i++) {
            this.board[i] = new Array(this.dimension).fill(this.empty);
        }

        // Place ships on the board
        for (let i = 0; i < this.ships; i++) {
            this.placeShip();
        }
    }

    placeShip() {
        // Place a ship on a random position
        const row = Math.floor(Math.random() * this.dimension);
        const col = Math.floor(Math.random() * this.dimension);

        // Check if the chosen position is already occupied by a ship
        if (this.board[row][col] === this.empty) {
            this.board[row][col] = this.boat;
        } else {
            // Try placing the ship again if the position is occupied
            this.placeShip();
        }
    }

    makeMove(row, col) {
        if (this.board[row][col] === this.boat) {
            // Player hit a ship
            this.board[row][col] = this.destroyed;
            this.shipsRemaining--;

            if (this.shipsRemaining === 0) {
                // All ships destroyed, player wins
                return 'You sank all the battleships! You win!';
            } else {
                return 'Hit! There are still ships remaining.';
            }
        } else if (this.board[row][col] === this.empty) {
            // Player missed
            this.board[row][col] = this.unknown;
            return 'Miss! Try again.';
        } else {
            // Player hit the same position again, prompt them to try again
            return 'You already hit this position. Try a different one.';
        }
    }

    getStatus() {
        // Return the current status of the game
        return `Ships remaining: ${this.shipsRemaining}\n${this.formatGameBoard()}`;
    }

    formatGameBoard() {
        const header = '  | ' + Array.from({ length: this.dimension }, (_, i) => i).join(' | ') + ' |';
        const separator = '|---' + Array.from({ length: this.dimension }, () => '---').join('') + '|';

        const rows = this.board.map((row, index) => ` ${index} | ${row.join(' | ')} |`);

        return `${header}\n${separator}\n${rows.join('\n')}`;
    }
}

module.exports = BattleshipGame;

