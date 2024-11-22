import Piece from './Piece';

export default class PieceFactory {
  constructor() {
    this.pipeKeys = ['pipeStraight', 'pipeCurved', 'pipeCross', 'pipeTee'];
  }

  createRandomPiece() {
    const type = this.pipeKeys[Math.floor(Math.random() * this.pipeKeys.length)];
    const rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
    return new Piece(type, rotation);
  }
}
