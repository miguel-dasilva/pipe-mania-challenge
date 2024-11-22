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
        this.scale = 1;
        this.offsetX = TILE_SIZE * 2;
        this.offsetY = 0;
        PositionCalculator.instance = this;
    }

    updateScale() {
        if (!window.game) return;
        
        const scene = window.game.scene.scenes[0];
        if (!scene) return;

        const gameWidth = scene.sys.game.config.width;
        const gameHeight = scene.sys.game.config.height;
        
        // Calculate the maximum size the grid can be while maintaining aspect ratio
        const maxGridWidth = gameWidth * 0.8; // Use 80% of screen width
        const maxGridHeight = gameHeight * 0.9; // Use 90% of screen height
        
        // Calculate scale based on available space
        const scaleX = maxGridWidth / (GRID_COLS * TILE_SIZE);
        const scaleY = maxGridHeight / (GRID_ROWS * TILE_SIZE);
        this.scale = Math.min(scaleX, scaleY);
        
        // Calculate offset to center the grid
        this.offsetX = (gameWidth - (GRID_COLS * TILE_SIZE * this.scale)) / 2;
        this.offsetY = (gameHeight - (GRID_ROWS * TILE_SIZE * this.scale)) / 2;
    }

    calculatePosition(row, col) {
        return {
            x: this.offsetX + (col * TILE_SIZE + TILE_SIZE / 2) * this.scale,
            y: this.offsetY + (row * TILE_SIZE + TILE_SIZE / 2) * this.scale
        }
    }

    screenToGrid(x, y) {
        const col = Math.floor((x - this.offsetX) / (TILE_SIZE * this.scale));
        const row = Math.floor((y - this.offsetY) / (TILE_SIZE * this.scale));
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
            x: this.offsetX + (GRID_COLS * TILE_SIZE) / 2 * this.scale,
            y: this.offsetY + (GRID_ROWS * TILE_SIZE) / 2 * this.scale
        }
    }
}

export const positionCalculator = PositionCalculator.getInstance();