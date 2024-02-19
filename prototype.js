// battleships.js

const THREE = require('three');

class BattleshipGame {
    constructor() {
        this.dimension = 10;
        this.cellSize = 50;
        this.boatColor = 0x3498db; // Blue color
        this.emptyColor = 0xecf0f1; // Silver color
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.playerBoard = [];
        this.botBoard = [];
        this.playerBoatsRemaining = 5;
        this.botBoatsRemaining = 5;
        this.isPlayerTurn = true;
    }

    init() {
        this.camera.position.z = 5;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.createBoard(0, 0, this.playerBoard);
        this.createBoard(2, 0, this.botBoard);

        document.addEventListener('mousedown', (event) => this.placeBoat(event));

        this.render();
    }

    createBoard(x, y, board) {
        for (let i = 0; i < this.dimension; i++) {
            board[i] = [];
            for (let j = 0; j < this.dimension; j++) {
                const geometry = new THREE.BoxGeometry();
                const material = new THREE.MeshBasicMaterial({ color: this.emptyColor });
                const cell = new THREE.Mesh(geometry, material);
                cell.position.x = x + j * this.cellSize;
                cell.position.y = y - i * this.cellSize;

                this.scene.add(cell);
                board[i][j] = { cell, status: 'empty' };
            }
        }
    }

    placeBoat(event) {
        if (this.isPlayerTurn && this.playerBoatsRemaining > 0) {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                const selectedCell = intersects[0].object;
                const row = Math.floor((selectedCell.position.y + this.cellSize / 2) / -this.cellSize);
                const col = Math.floor((selectedCell.position.x - this.cellSize / 2) / this.cellSize);

                if (this.playerBoard[row][col].status === 'empty') {
                    selectedCell.material.color.setHex(this.boatColor);
                    this.playerBoard[row][col].status = 'boat';
                    this.playerBoatsRemaining--;

                    if (this.playerBoatsRemaining === 0) {
                        this.startGame();
                    }
                }
            }
        }
    }

    startGame() {
        // Bot's turn to place boats randomly
        this.botPlaceBoatsRandomly();
        this.isPlayerTurn = true;
    }

    botPlaceBoatsRandomly() {
        for (let i = 0; i < this.botBoatsRemaining; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.dimension);
                col = Math.floor(Math.random() * this.dimension);
            } while (this.botBoard[row][col].status === 'boat');

            this.botBoard[row][col].cell.material.color.setHex(this.boatColor);
            this.botBoard[row][col].status = 'boat';
        }
    }

    render() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }
}

module.exports = BattleshipGame;
