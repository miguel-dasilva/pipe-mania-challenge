// src/scenes/GameScene.js
import Phaser from 'phaser';
import Grid from '../objects/Grid';
import Queue from '../objects/Queue';
import GameStateManager from '../managers/GameStateManager';
import PositionCalculator from '../utils/PositionCalculator';
import { TILE_SIZE } from '../config';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('background', 'assets/platformIndustrial_094.png');
    this.load.image('pipeCurved', 'assets/pipeGrey_01.png');
    this.load.image('pipeStraight', 'assets/pipeGrey_03.png');
    this.load.image('pipeCross', 'assets/pipeGrey_06.png');
    this.load.image('pipeTee', 'assets/pipeGrey_05.png');

    this.load.image('backTile', 'assets/BackTile_06.png')

    this.load.image('water', 'assets/waterTexture.png');
  }

  create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    const positionCalculator = PositionCalculator.getInstance();

    // Initialize the grid and game state manager
    this.grid = new Grid(this, positionCalculator);
    this.gameState = new GameStateManager(this, this.grid, positionCalculator);

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
    if (this.gameState.gameEnded) return;
    const gridPos = this.grid.positionCalculator.screenToGrid(pointer.x, pointer.y);
    
    if (this.grid.positionCalculator.isValidGridPosition(gridPos.row, gridPos.col)) {
      if (!this.grid.isBlocked(gridPos.row, gridPos.col)) {
        if (!this.grid.isEmpty(gridPos.row, gridPos.col)) {
          this.grid.removePipe(gridPos.row, gridPos.col);
        }

        const piece = this.queue.dequeue();
        if (piece) {
          this.grid.placePipe(gridPos.row, gridPos.col, piece);
          this.queue.enqueue();
        }
      }
    }
  }
}
