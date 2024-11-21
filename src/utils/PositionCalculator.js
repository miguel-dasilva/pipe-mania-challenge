import { TILE_SIZE, GRID_ROWS, GRID_COLS } from '../config';

export default class PositionCalculator {
    static instance = null;

    static getInstance() {
        if (!PositionCalculator.instance) {
            PositionCalculator.instance = new PositionCalculator();
        }
        return PositionCalculator.instance;
    }

    constructor() {
        if (PositionCalculator.instance) {
            return PositionCalculator.instance;
        }
        this.offsetX = TILE_SIZE * 2;
        PositionCalculator.instance = this;
    }

    calculatePosition(row, col) {
        return {
            x: this.offsetX + col * TILE_SIZE + TILE_SIZE / 2,
            y: row * TILE_SIZE + TILE_SIZE / 2
        }
    }

    screenToGrid(x, y) {
        const col = Math.floor((x - this.offsetX) / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        return { col, row };
    }

    isValidGridPosition(row, col) {
        return row >= 0 && row < GRID_ROWS && 
               col >= 0 && col < GRID_COLS;
    }

    getNextCell(row, col, direction) {
        switch (direction) {
            case 'top': return row > 0 ? { row: row - 1, col } : null;
            case 'bottom': return row < GRID_ROWS - 1 ? { row: row + 1, col } : null;
            case 'left': return col > 0 ? { row, col: col - 1 } : null;
            case 'right': return col < GRID_COLS - 1 ? { row, col: col + 1 } : null;
        }
    }

    getCellCenter(row, col) {
        const position = this.calculatePosition(row, col);
        return {
            x: position.x,
            y: position.y
        };
    }

    calculateCenterPosition() {
        return {
            x: this.offsetX + (GRID_COLS * TILE_SIZE) / 2,
            y: GRID_ROWS * TILE_SIZE / 2
        }
    }
}

export const positionCalculator = PositionCalculator.getInstance();