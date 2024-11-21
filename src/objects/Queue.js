import PieceFactory from './PieceFactory';

import { TILE_SIZE } from '../config';
export default class Queue {
  constructor(scene, x, y, startingSize = 5) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.queue = [];
    this.cellSize = TILE_SIZE;
    this.pieceFactory = new PieceFactory();
    for (let i = 0; i < startingSize; i++) {
        this.queue.push(this.pieceFactory.createRandomPiece());
    }

    this.renderQueue();
  }

  enqueue() {
    this.queue.push(this.pieceFactory.createRandomPiece());
    this.renderQueue();
  }

  dequeue() {
    if (this.queue.length > 0) {
        const piece = this.queue.shift();
        this.renderQueue();
        return piece;
    }

    return null;
  }

  renderQueue() {
    this.queue.forEach(piece => piece.destroySprite());

    this.queue.forEach((piece, index) => {
        const x = this.x;
        const y = this.y + index * this.cellSize;
        piece.render(this.scene, x, y);
    });
  }
}
