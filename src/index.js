import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene],  // Add GameScene here
};

const game = new Phaser.Game(config);
