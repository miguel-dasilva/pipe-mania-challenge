export default class Piece {
  constructor(type, rotation = 0) {
    this.type = type;
    this.rotation = rotation;
    this.sprite = null;
  }

  render(scene, x, y) {
    if (this.sprite) {
      this.destroySprite();
    }

    this.sprite = scene.add.image(x, y, this.getTextureKey())
      .setRotation(this.rotation * Math.PI / 180)
  }

  destroySprite() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }

  getTextureKey() {
    return `pipe${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`;
  }

  getWetTextureKey() {
    return `${this.getTextureKey()}Wet`;
  }
}
