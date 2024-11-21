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

    this.sprite = scene.add.image(x, y, this.type)
      .setRotation(this.rotation * Math.PI / 180)
  }

  destroySprite() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }

  getWetTextureKey() {
    return `${this.type}Wet`;
  }
}
