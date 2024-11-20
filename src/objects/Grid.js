// src/objects/Grid.js
import { TILE_SIZE, GRID_ROWS, GRID_COLS } from '../config';

export default class Grid {
  constructor(scene) {
    this.scene = scene;
    this.grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  }

  createGrid() {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;
        this.scene.add.rectangle(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, 0xcccccc).setStrokeStyle(2, 0x000000);
      }
    }
  }

  placePipe(row, col, pipeType) {
    const x = col * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const pipe = this.scene.add.image(x, y, pipeType); 
    pipe.setDisplaySize(TILE_SIZE, TILE_SIZE); // TODO: MAYBE RESIZE THE ORIGINAL IMAGE PREEMPTIVELY
    this.grid[row][col] = pipeType;
  }

  isEmpty(row, col) {
    return !this.grid[row][col];
  }
}
