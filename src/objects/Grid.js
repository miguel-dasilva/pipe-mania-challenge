import Piece from './Piece';
import { TILE_SIZE, GRID_ROWS, GRID_COLS } from '../config';

export default class Grid {
  constructor(scene) {
    this.scene = scene;
    this.grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
    this.offsetX = TILE_SIZE * 2;
    this.blockedCells = [];
    this.startCell = null;
    this.waterIsFlowing = false;
    this.onWaterFlowEnd = null;

    this.initializeBlockedCells();
    this.setStartCell();
  }

  initializeBlockedCells() {
    const totalCells = GRID_ROWS * GRID_COLS;
    const numBlockedCells = Math.floor(Math.random() * (totalCells * 0.15 - totalCells * 0.10) + totalCells * 0.10);

    for (let i = 0; i < numBlockedCells; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * GRID_ROWS);
        col = Math.floor(Math.random() * GRID_COLS);
      } while (this.isBlocked(row, col));

      this.blockedCells.push({ row, col });
    }
  }

  setStartCell() {
    let row, col;
    do {
      row = Math.floor(Math.random() * (GRID_ROWS - 1));
      col = Math.floor(Math.random() * (GRID_COLS));
    } while (this.isBlocked(row, col) || this.isBlocked(row + 1, col)); // Ensure start cell is not directly below a blocked cell

    this.startCell = { row, col };
  }

  isBlocked(row, col) {
    return this.blockedCells.some(cell => cell.row === row && cell.col === col);
  }

  createGrid() {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = this.offsetX + col * TILE_SIZE;
        const y = row * TILE_SIZE;

        this.scene.add.rectangle(
          x + TILE_SIZE / 2,
          y + TILE_SIZE / 2,
          TILE_SIZE,
          TILE_SIZE,
          this.isBlocked(row, col) ? 0x888888 : 0xcccccc
        ).setStrokeStyle(2, 0x000000);

        if (this.startCell && row === this.startCell.row && col === this.startCell.col) {
          this.scene.add.circle(
            x + TILE_SIZE / 2,
            y + TILE_SIZE / 2,
            TILE_SIZE / 6,
            0x0000ff
          );

          const startPiece = new Piece('pipeStraight', 0);
          this.placePipe(row, col, startPiece);
          this.grid[row][col] = startPiece;
        }
      }
    }
  }

  removePipe(row, col) {
    this.grid[row][col].destroySprite();
    this.grid[row][col] = null;
  }

  placePipe(row, col, piece) {
    const x = this.offsetX + col * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    piece.render(this.scene, x, y);
    this.grid[row][col] = piece;
  }

  isEmpty(row, col) {
    return !this.grid[row][col];
  }

  startWaterFlow() {
    console.log("Starting water flow");
    const startPiece = this.grid[this.startCell.row][this.startCell.col];
    if (startPiece) {
      this.waterIsFlowing = true;
      this.flowWater(this.startCell.row, this.startCell.col, 'top');
    }
  }

  flowWater(row, col, incomingDirection) {
    const piece = this.grid[row][col];
    if (!piece || piece.isWet || !piece.canReceiveWaterFrom(incomingDirection)) {
      console.log("fake game end")
      return;
    }

    this.waterIsFlowing = true;
    const x = this.offsetX + col * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    piece.addWater(this.scene, x, y, 'water');

    const outputs = piece.getWaterOutputs(incomingDirection);

    setTimeout(() => {
      let hasValidConnection = false;
      outputs.forEach(direction => {
        const nextCell = this.getNextCell(row, col, direction);
        if (nextCell) {
          const nextPiece = this.grid[nextCell.row][nextCell.col];
          if (nextPiece && !nextPiece.isWet &&
              nextPiece.canReceiveWaterFrom(this.getOppositeDirection(direction))) {
            hasValidConnection = true;
            this.flowWater(nextCell.row, nextCell.col, this.getOppositeDirection(direction));
          }
        }
      });

      if (!hasValidConnection) {
        this.checkFlowComplete();
      }
    }, 500);
  }

  checkFlowComplete() {
    this.waterIsFlowing = false;
    setTimeout(() => {
      if (!this.waterIsFlowing && this.onWaterFlowEnd) {
        this.onWaterFlowEnd();
      }
    }, 500);
  }

  getWetPieces() {
    return this.grid.flatMap((row, rowIndex) => 
      row.map((piece, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        piece
      })).filter(({piece}) => piece && piece.isWet)
    );
  }

  getOppositeDirection(direction) {
    const opposites = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    };

    return opposites[direction];
  }

  getNextCell(row, col, direction) {
    switch (direction) {
      case 'top': return row > 0 ? { row: row - 1, col } : null;
      case 'bottom': return row < GRID_ROWS - 1 ? { row: row + 1, col } : null;
      case 'left': return col > 0 ? { row, col: col - 1 } : null;
      case 'right': return col < GRID_COLS - 1 ? { row, col: col + 1 } : null;
    }
  }
}
