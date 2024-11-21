import { TILE_SIZE, GRID_ROWS, GRID_COLS } from '../config';

export default class GameStateManager {
  constructor(scene, grid) {
    this.scene = scene;
    this.grid = grid;
    this.gameEnded = false;
    this.minimumLength = this.generateMinimumLength();

    this.grid.onWaterFlowEnd = () => this.checkWinCondition();

    this.displayGoal();
  }

  generateMinimumLength() {
    const baseLength = Math.floor((GRID_ROWS + GRID_COLS) / 2);
    const variation = Math.floor(Math.random() * 3);
    return baseLength + variation;
  }

  displayGoal() {
    this.scene.add.text(
      TILE_SIZE * 8 + this.grid.offsetX,
      TILE_SIZE,
      `Goal: ${this.minimumLength}`,
      { 
        fontSize: '24px',
        fill: '#ffffff'
      }
    );
  }

  checkWinCondition() {
    console.log("checkWinCondition");
    console.log("gameEnded", this.gameEnded);
    if (this.gameEnded) return;
    this.gameEnded = true;

    const pathLength = this.calculatePathLength();
    const isWin = pathLength >= this.minimumLength;

    this.showGameOverUI(isWin, pathLength);
  }

  showGameOverUI(isWin, pathLength) {
    const gameOverText = this.scene.add.text(
      this.grid.offsetX + (GRID_COLS * TILE_SIZE) / 2,
      GRID_ROWS * TILE_SIZE / 2,
      isWin ? 
        `You Win!\nPath Length: ${pathLength}` : 
        `Game Over\nPath Length: ${pathLength}/${this.minimumLength}`,
      {
        fontSize: '32px',
        fill: isWin ? '#00ff00' : '#ff0000',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 },
        align: 'center'
      }
    ).setOrigin(0.5);

    this.addRestartButton(gameOverText);
  }

  addRestartButton(gameOverText) {
    const restartButton = this.scene.add.text(
      gameOverText.x,
      gameOverText.y + 80,
      'Restart',
      {
        fontSize: '24px',
        fill: '#ffffff',
        backgroundColor: '#444444',
        padding: { x: 20, y: 10 }
      }
    )
    .setOrigin(0.5)
    .setInteractive();

    restartButton.on('pointerdown', () => {
      this.scene.scene.restart();
    });
  }

  calculatePathLength() {
    console.log("calculatePathLength");
    let maxLength = 0;
    const visited = new Set();
    const wetPieces = this.grid.getWetPieces();

    const startPiece = wetPieces.find(({ row, col }) =>
      row === this.grid.startCell.row && col === this.grid.startCell.col
    );

    if (!startPiece) return 0;

    const countPath = (row, col, currentLength = 0) => {
        const key = `${row},${col}`;
        if (visited.has(key)) {
            maxLength = Math.max(maxLength, currentLength);
            return;
        }

        const currentPiece = wetPieces.find(piece => piece.row === row && piece.col === col);
        if (!currentPiece) {
            maxLength = Math.max(maxLength, currentLength);
            return;
        }

        visited.add(key);
        currentLength++;

        ['top', 'bottom', 'left', 'right'].forEach(direction => {
            const nextCell = this.grid.getNextCell(row, col, direction);
            if (nextCell) {
                countPath(nextCell.row, nextCell.col, currentLength);
            }
        });

        visited.delete(key);
    };

    countPath(startPiece.row, startPiece.col);
    return maxLength;
  }
}