import { TILE_SIZE, GRID_ROWS, GRID_COLS } from '../config';

export default class GameStateManager {
  constructor(scene, grid, positionCalculator) {
    this.scene = scene;
    this.grid = grid;
    this.gameEnded = false;
    this.minimumLength = this.generateMinimumLength();
    this.positionCalculator = positionCalculator;

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
      TILE_SIZE * 8 + this.positionCalculator.offsetX,
      TILE_SIZE,
      `Goal: ${this.minimumLength}`,
      { 
        fontSize: '24px',
        fill: '#ffffff'
      }
    );
  }

  checkWinCondition() {
    if (this.gameEnded) return;
    this.gameEnded = true;

    const pathLength = this.calculatePathLength();
    const isWin = pathLength >= this.minimumLength;

    this.scene.gameOver(isWin, pathLength, this.minimumLength);
  }

  calculatePathLength() {
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
            const nextCell = this.grid.positionCalculator.getNextCell(row, col, direction);
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