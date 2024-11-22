import GameState from './GameState';

export default class GameOverState extends GameState {
  constructor(game, isWin, pathLength, minimumLength) {
    super(game);
    this.isWin = isWin;
    this.pathLength = pathLength;
    this.minimumLength = minimumLength;
  }

  enter() {
    const centerPosition = this.game.positionCalculator.calculateCenterPosition();
    
    const gameOverText = this.game.add.text(
      centerPosition.x,
      centerPosition.y,
      this.isWin ? 
        `You Win!\nPath Length: ${this.pathLength}` : 
        `Game Over\nPath Length: ${this.pathLength}/${this.minimumLength}`,
      {
        fontSize: '32px',
        fill: this.isWin ? '#00ff00' : '#ff0000',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 },
        align: 'center'
      }
    ).setOrigin(0.5);

    this.addRestartButton(gameOverText);
  }

  addRestartButton(gameOverText) {
    const restartButton = this.game.add.text(
        gameOverText.x,
        gameOverText.y + 80,
        'Restart',
        {
        fontSize: '24px',
        fill: '#ffffff',
        backgroundColor: '#444444',
        padding: { x: 20, y: 10 }
        }
    )
    .setOrigin(0.5)
    .setInteractive();

    restartButton.on('pointerdown', () => {
        this.game.scene.restart();
    });
  }
}