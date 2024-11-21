// src/scenes/GameScene.js
import Phaser from 'phaser';
import Grid from '../objects/Grid';
import Queue from '../objects/Queue';
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

    this.load.image('water', 'assets/waterTexture.png');
  }

  create() {
    // Initialize the grid
    this.grid = new Grid(this);
    this.grid.createGrid();

    // Initialize the queue
    this.queue = new Queue(this, TILE_SIZE, TILE_SIZE);

    // Handle Inputs
    this.input.on('pointerdown', (pointer) => this.handleGridClick(pointer));

    this.time.delayedCall(5000, () => {
      this.grid.startWaterFlow();
    });
  }

  handleGridClick(pointer) {
    const col = Math.floor((pointer.x - this.grid.offsetX) / TILE_SIZE);
    const row = Math.floor(pointer.y / TILE_SIZE);

    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      if (!this.grid.isBlocked(row, col)) {
        if (!this.grid.isEmpty(row, col)) {
          this.grid.removePipe(row, col);
        }

        const piece = this.queue.dequeue();
        if (piece) {
          this.grid.placePipe(row, col, piece);
          this.queue.enqueue();
        }
      }
    }
  }
}
