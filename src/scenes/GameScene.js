// src/scenes/GameScene.js
import Phaser from 'phaser';
import Grid from '../objects/Grid';
import { TILE_SIZE } from '../config';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('pipe', 'assets/pipeGrey_01.png');
  }

  create() {
    // Initialize the grid
    this.grid = new Grid(this);
    this.grid.createGrid();  // Create the grid on screen

    // Handle click events
    this.input.on('pointerdown', (pointer) => this.handleGridClick(pointer));
  }

  handleGridClick(pointer) {
    const col = Math.floor(pointer.x / TILE_SIZE);
    const row = Math.floor(pointer.y / TILE_SIZE);

    if (this.grid.isEmpty(row, col)) {
      this.grid.placePipe(row, col, 'pipe');  // Place a pipe on the clicked grid position
    }
  }
}
