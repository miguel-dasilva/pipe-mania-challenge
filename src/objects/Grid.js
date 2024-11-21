import Piece from './Piece';
import WaterFlowManager from '../managers/WaterFlowManager';
import { TILE_SIZE, GRID_ROWS, GRID_COLS, BLOCKED_CELLS_MIN_PERCENTAGE, BLOCKED_CELLS_MAX_PERCENTAGE, WATER_FLOW_DELAY } from '../config';

export default class Grid {
  constructor(scene, positionCalculator) {
    this.scene = scene;
    this.grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
    this.positionCalculator = positionCalculator;
    this.blockedCells = [];
    this.startCell = null;
    this.waterManager = new WaterFlowManager(this, this.scene, this.positionCalculator);

    this.initializeBlockedCells();
    this.setStartCell();
  }

  initializeBlockedCells() {
    const totalCells = GRID_ROWS * GRID_COLS;
    const numBlockedCells = Math.floor(
      Math.random() * 
      (totalCells * BLOCKED_CELLS_MAX_PERCENTAGE - 
       totalCells * BLOCKED_CELLS_MIN_PERCENTAGE) +
      totalCells * BLOCKED_CELLS_MIN_PERCENTAGE
    );

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
        const position = this.positionCalculator.calculatePosition(row, col);

        this.scene.add.image(
          position.x,
          position.y,
          'backTile'
        ).setTint(this.isBlocked(row, col) ? 0x666666 : 0xaaaaaa);

        if (this.startCell && row === this.startCell.row && col === this.startCell.col) {
          this.scene.add.circle(
            position.x,
            position.y,
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
    const position = this.positionCalculator.calculatePosition(row, col);
    piece.render(this.scene, position.x, position.y);
    this.grid[row][col] = piece;
  }

  isEmpty(row, col) {
    return !this.grid[row][col];
  }

  startWaterFlow() {
    this.waterManager.onWaterFlowEnd = () => {
      if (this.onWaterFlowEnd) {
        this.onWaterFlowEnd();
      }
    };
    this.waterManager.startFlow(this.startCell);
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

  getPieceAt(row, col) {
    return this.grid[row][col];
  }

  getDimensions() {
    return { GRID_ROWS, GRID_COLS };
  }

  getAllPieces() {
    return this.grid.flat().filter(piece => piece !== null);
  }
}
