// battleships.js

class BattleshipGame {
    constructor() {
        this.dimension = 10;
        this.playerBoard = [];
        this.botBoard = [];
        this.playerBoatsRemaining = 5;
        this.botBoatsRemaining = 5;
        this.isPlayerTurn = true;
    }

    init() {
        this.createBoard(this.playerBoard);
        this.createBoard(this.botBoard);
    }

    createBoard(board) {
        for (let i = 0; i < this.dimension; i++) {
            board[i] = [];
            for (let j = 0; j < this.dimension; j++) {
                board[i][j] = { status: 'empty' };
            }
        }
    }

    placePlayerBoat(row, col) {
        if (row < 0 || row >= this.dimension || col < 0 || col >= this.dimension) {
            return false; // Invalid row or column
        }

        if (this.playerBoard[row][col].status === 'empty') {
            this.playerBoard[row][col].status = 'boat';
            this.playerBoatsRemaining--;
            return true;
        }

        return false; // Position already occupied by a boat
    }


    botPlaceBoatsRandomly() {
        for (let i = 0; i < this.botBoatsRemaining; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.dimension);
                col = Math.floor(Math.random() * this.dimension);
            } while (row < 0 || row >= this.dimension || col < 0 || col >= this.dimension || this.botBoard[row][col].status === 'boat');

            this.botBoard[row][col].status = 'boat';
        }
    }


    makePlayerMove(row, col) {
        if (row < 0 || row >= this.dimension || col < 0 || col >= this.dimension) {
            return 'Invalid move. Try again.'; // Invalid row or column
        }

        if (this.botBoard[row][col].status === 'boat') {
            this.botBoard[row][col].status = 'hit';
            this.botBoatsRemaining--;

            if (this.botBoatsRemaining === 0) {
                return 'You sank all the battleships! You win!';
            } else {
                return 'Hit! There are still ships remaining.';
            }
        } else if (this.botBoard[row][col].status === 'empty') {
            this.botBoard[row][col].status = 'miss';
            return 'Miss! Try again.';
        } else {
            return 'You already hit this position. Try a different one.';
        }
    }


    makeBotMove() {
        let row, col;
        do {
            row = Math.floor(Math.random() * this.dimension);
            col = Math.floor(Math.random() * this.dimension);
        } while (row < 0 || row >= this.dimension || col < 0 || col >= this.dimension);

        if (this.playerBoard[row][col].status === 'boat') {
            this.playerBoard[row][col].status = 'hit';
            this.playerBoatsRemaining--;

            if (this.playerBoatsRemaining === 0) {
                return 'Game over. Bot sank all your battleships!';
            } else {
                return 'Bot hit! Your turn.';
            }
        } else if (this.playerBoard[row][col].status === 'empty') {
            this.playerBoard[row][col].status = 'miss';
            return 'Bot missed. Your turn.';
        } else {
            return 'Bot hit the same position again. It will try a different one.';
        }
    }


    getStatus() {
        return `Your boats remaining: ${this.playerBoatsRemaining}\n${this.formatGameBoard(this.playerBoard)}\n\n` +
            `Bot has this many boats remaining: ${this.botBoatsRemaining}\n${this.formatGameBoard(this.botBoard)}`;
    }

    formatGameBoard(board) {
        return board.map(row => row.map(cell => (cell.status === 'boat' || cell.status === 'hit') ? 'X' : (cell.status === 'miss') ? 'O' : '.').join(' ')).join('\n');
    }

}

module.exports = BattleshipGame;
