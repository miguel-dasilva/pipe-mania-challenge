import { WATER_FLOW_DELAY, WATER_FLOW_SPEED } from '../config';

export default class WaterFlowManager {
    constructor(grid, scene, positionCalculator) {
        this.grid = grid;
        this.scene = scene;
        this.positionCalculator = positionCalculator;
        this.waterIsFlowing = false;
        this.onWaterFlowEnd = null;
    }

    startFlow(startCell) {
        const startPiece = this.grid.getPieceAt(startCell.row, startCell.col);
        if (!startPiece) return;

        this.waterIsFlowing = true;
        this.flowWater(startCell.row, startCell.col, 'top');
    }

    flowWater(row, col, incomingDirection) {
        if (!this.canFlowWater(row, col, incomingDirection)) return;

        this.waterIsFlowing = true;
        this.addWaterToPiece(row, col);
        this.scheduleWaterFlow(row, col, incomingDirection);
    }

    canFlowWater(row, col, incomingDirection) {
        if (!this.positionCalculator.isValidGridPosition(row, col)) return false;
        const piece = this.grid.getPieceAt(row, col);
        return piece && 
            !piece.isWet &&
            piece.canReceiveWaterFrom(incomingDirection);
    }

    addWaterToPiece(row, col) {
        const piece = this.grid.getPieceAt(row, col);
        const position = this.positionCalculator.calculatePosition(row, col);

        piece.addWater(this.scene, position.x, position.y, 'water');
    }

    scheduleWaterFlow(row, col, incomingDirection) {
        const piece = this.grid.getPieceAt(row, col);
        const outputs = piece.getWaterOutputs(incomingDirection);

        setTimeout(() => {
            const hasValidConnection = this.processOutputs(row, col, outputs);
            if (!hasValidConnection) {
              this.checkFlowComplete();
            }
        }, WATER_FLOW_DELAY);
    }

    processOutputs(row, col, outputs) {
        let hasValidConnection = false;

        outputs.forEach(direction => {
          const nextCell = this.positionCalculator.getNextCell(row, col, direction);
          if (nextCell && this.canFlowWater(nextCell.row, nextCell.col, this.getOppositeDirection(direction))) {
            hasValidConnection = true;
            this.flowWater(
              nextCell.row,
              nextCell.col,
              this.getOppositeDirection(direction)
            );
          }
        });
    
        return hasValidConnection;
    }

    getOppositeDirection(direction) {
        const opposites = {
          top: 'bottom',
          bottom: 'top',
          left: 'right',
          right: 'left'
        };
        return opposites[direction];
    }

    checkFlowComplete() {
        this.waterIsFlowing = false;
        setTimeout(() => {
          if (!this.waterIsFlowing && this.onWaterFlowEnd) {
            this.onWaterFlowEnd();
          }
        }, WATER_FLOW_DELAY);
    }
}