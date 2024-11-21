import { PipeConnections } from "../types/PipeTypes";
import WaterFlow from "./WaterFlow";
export default class Piece {
  constructor(type, rotation = 0) {
    this.type = type;
    this.rotation = rotation;
    this.sprite = null;
    this.isWet = false;
    this.waterSprite = null;
    this.connections = PipeConnections[type][rotation];
  }

  canReceiveWaterFrom(direction) {
    return this.connections.in.includes(direction);
  }

  getWaterOutputs(incomingDirection) {
    return this.connections.out.filter(direction => direction !== incomingDirection);
  }

  render(scene, x, y) {
    if (this.sprite) {
      this.destroySprite();
    }

    // Main sprite
    this.sprite = scene.add.image(x, y, this.type)
        .setRotation(this.rotation * Math.PI / 180);
  }

  addWater(scene, x, y, waterTextureKey, incomingDirection = 'top') {
    if (!this.isWet) {
      this.isWet = true;

      if (!this.waterFlow) {
        this.waterFlow = new WaterFlow(scene, x, y);
      }

      const offset = 32;
      const startPos = this.getPositionFromDirection(incomingDirection, offset);
      const centerPos = { x, y };

      this.waterFlow.createWaterFlow(
        { x: x + startPos.x, y: y + startPos.y },
        centerPos
      );

      const outputs = this.getWaterOutputs(incomingDirection);
      outputs.forEach(direction => {
        const endPos = this.getPositionFromDirection(direction, offset);
        
        scene.time.delayedCall(200, () => {
          this.waterFlow.createWaterFlow(
            centerPos,
            { x: x + endPos.x, y: y + endPos.y }
          );
        });
      });
    }

  }

  getPositionFromDirection(direction, offset) {
    switch (direction) {
      case 'top': return { x: 0, y: -offset };
      case 'bottom': return { x: 0, y: offset };
      case 'left': return { x: -offset, y: 0 };
      case 'right': return { x: offset, y: 0 };
      default: return { x: 0, y: 0 };
    }
  }

  destroySprite() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }

    if (this.waterSprite) {
      this.waterSprite.destroy();
      this.waterSprite = null;
    } 
  }
}
