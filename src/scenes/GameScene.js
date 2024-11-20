// src/scenes/GameScene.js
import Phaser from 'phaser';
import Grid from '../objects/Grid';
import { TILE_SIZE, GRID_ROWS, GRID_COLS } from '../config';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('pipeCurved', 'assets/pipeGrey_01.png');
    this.load.image('pipeStraight', 'assets/pipeGrey_03.png');
    this.load.image('pipeCross', 'assets/pipeGrey_06.png');
    this.load.image('pipeTee', 'assets/pipeGrey_05.png');
  }

  create() {
    // Initialize the grid
    this.grid = new Grid(this);
    this.grid.createGrid();

    // Handle click events
    this.input.on('pointerdown', (pointer) => this.handleGridClick(pointer));
  }

  handleGridClick(pointer) {
    const col = Math.floor(pointer.x / TILE_SIZE);
    const row = Math.floor(pointer.y / TILE_SIZE);

    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      this.grid.placePipe(row, col, 'pipe');  // Place a pipe on the clicked grid position
    }
  }
}
