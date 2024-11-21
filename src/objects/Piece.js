import { PipeConnections } from "../types/PipeTypes";

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
    console.log(direction, " -> Can receive water from: ", this.connections.in);
    return this.connections.in.includes(direction);
  }

  getWaterOutputs(incomingDirection) {
    console.log(incomingDirection, " -> Output directions: ", this.connections.out.filter(direction => direction !== incomingDirection));
    return this.connections.out.filter(direction => direction !== incomingDirection);
  }

  render(scene, x, y) {
    if (this.sprite) {
      this.destroySprite();
    }

    this.sprite = scene.add.image(x, y, this.type)
      .setRotation(this.rotation * Math.PI / 180)
  }

  addWater(scene, x, y, waterTextureKey) {
    if (!this.isWet) {
      this.isWet = true;
      this.waterSprite = scene.add.image(x, y, waterTextureKey)
        .setRotation(this.rotation * Math.PI / 180)
        .setAlpha(0);

      scene.tweens.add({
        targets: this.waterSprite,
        alpha: 1,
        duration: 300,
        ease: 'Linear'
      });
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

  getWetTextureKey() {
    return `${this.type}Wet`;
  }
}
