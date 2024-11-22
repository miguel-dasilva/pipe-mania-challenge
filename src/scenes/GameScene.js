// src/scenes/GameScene.js
import Phaser from 'phaser';
import Grid from '../core/Grid';
import GameStateManager from '../managers/GameStateManager';
import PositionCalculator from '../utils/PositionCalculator';
import PlayingState from '../states/PlayingState';
import GameOverState from '../states/GameOverState';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.currentState = null;
    this.positionCalculator = PositionCalculator.getInstance();
  }

  preload() {
    this.load.image('background', 'assets/platformIndustrial_094.png');
    
    this.load.image('pipeStart', 'assets/pipeGrey_02.png');
    this.load.image('pipeCurved', 'assets/pipeGrey_01.png');
    this.load.image('pipeStraight', 'assets/pipeGrey_03.png');
    this.load.image('pipeCross', 'assets/pipeGrey_06.png');
    this.load.image('pipeTee', 'assets/pipeGrey_05.png');

    this.load.image('backTile', 'assets/BackTile_06.png')

    this.load.image('water', 'assets/waterTexture.png');
  }

  create() {
    this.scale.on('resize', this.handleResize, this);

    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    // Initialize the grid and game state manager
    this.grid = new Grid(this, this.positionCalculator);
    this.gameState = new GameStateManager(this, this.grid, this.positionCalculator);

    this.setState(new PlayingState(this));

    // Handle Inputs
    this.input.on('pointerdown', (pointer) => this.currentState.handleInput(pointer));

    this.time.delayedCall(5000, () => {
      this.grid.startWaterFlow();
    });
  }

  handleResize(gameSize) {
    this.positionCalculator.updateScale();
    if (this.grid) {
      this.grid.recreateGrid();
    }
  }

  setState(newState) {
    if (this.currentState) {
      this.currentState.exit();
    }

    this.currentState = newState;
    this.currentState.enter();
  }

  gameOver(isWin, pathLength, minimumLength) {
    this.setState(new GameOverState(this, isWin, pathLength, minimumLength));
  }
}