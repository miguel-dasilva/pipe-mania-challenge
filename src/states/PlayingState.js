import GameState from './GameState';
import Queue from '../core/Queue';
import { TILE_SIZE } from '../config';

export default class PlayingState extends GameState {
  enter() {
    this.game.grid.createGrid();
    this.game.queue = new Queue(this.game, TILE_SIZE, TILE_SIZE);
  }

  handleInput(pointer) {
    const gridPos = this.game.grid.positionCalculator.screenToGrid(pointer.x, pointer.y);
    
    if (this.game.grid.positionCalculator.isValidGridPosition(gridPos.row, gridPos.col)) {
        if (!this.game.grid.isBlocked(gridPos.row, gridPos.col)) {
            if (!this.game.grid.isEmpty(gridPos.row, gridPos.col)) {
                if (!this.game.grid.canRemovePipe(gridPos.row, gridPos.col)) return;
                this.game.grid.removePipe(gridPos.row, gridPos.col);
            }

            const piece = this.game.queue.dequeue();
            if (piece) {
                this.game.grid.placePipe(gridPos.row, gridPos.col, piece);
                this.game.queue.enqueue();
            }
      }
    }
  }
}