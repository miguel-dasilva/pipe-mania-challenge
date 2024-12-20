import { TILE_SIZE, GRID_ROWS, GRID_COLS, WATER_FLOW_COUNTDOWN } from '../config';

export default class GameManager {
  constructor(scene, grid, positionCalculator) {
    this.scene = scene;
    this.grid = grid;
    this.gameEnded = false;
    this.minimumLength = this.generateMinimumLength();
    this.positionCalculator = positionCalculator;
    this.countdownTime = Math.floor(WATER_FLOW_COUNTDOWN / 1000);
    this.countdownText = null;

    this.grid.onWaterFlowEnd = () => this.checkWinCondition();

    this.displayGoal();
  }

  startWaterFlowCountdown() {
    this.displayWaterCountdown();
    this.scene.time.delayedCall(WATER_FLOW_COUNTDOWN, () => {
      this.grid.startWaterFlow();
    });
  }

  generateMinimumLength() {
    const baseLength = Math.floor((GRID_ROWS + GRID_COLS) / 2);
    const variation = Math.floor(Math.random() * 3);
    return baseLength + variation;
  }

  displayGoal() {
    const x = this.positionCalculator.offsetX + (GRID_COLS * TILE_SIZE * this.positionCalculator.scale) + TILE_SIZE;
    const y = this.positionCalculator.offsetY / 2;
    
    this.scene.add.text(
      x,
      y,
      `Goal: ${this.minimumLength}`,
      { 
        fontSize: '24px',
        fill: '#ffffff'
      }
    );
  }

  displayWaterCountdown() {
    const x = this.positionCalculator.offsetX + (GRID_COLS * TILE_SIZE * this.positionCalculator.scale) + TILE_SIZE;
    const y = this.positionCalculator.offsetY / 2 + 40;

    this.countdownText = this.scene.add.text(
      x,
      y,
      `⏱ ${this.countdownTime}`,
      {
          fontSize: '24px',
          fill: '#ffffff',
          padding: { x: 10, y: 5 },
          fixedWidth: 80,
          align: 'center'
      }
    );

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.updateCountdown,
      callbackScope: this,
      repeat: this.countdownTime - 1
    });
  }

  updateCountdown() {
    this.countdownTime--;
    
    if (this.countdownTime >= 0) {
        this.countdownText.setText(`⏱ ${this.countdownTime}`);

        if (this.countdownTime === 0) {
          this.scene.tweens.add({
            targets: this.countdownText,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            yoyo: true,
            repeat: -1,
        });
      }
    }
  }

  checkWinCondition() {
    if (this.gameEnded) return;
    this.gameEnded = true;

    if (this.countdownText) {
      this.countdownText.destroy();
    }

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