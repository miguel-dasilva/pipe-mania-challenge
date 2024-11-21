import Piece from './Piece';

export default class PieceFactory {
  constructor() {
    this.pipeKeys = ['straight', 'curved', 'cross', 'tee'];
  }

  createRandomPiece() {
    const type = this.pipeKeys[Math.floor(Math.random() * this.pipeKeys.length)];
    const rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
    return new Piece(type, rotation);
  }
}
