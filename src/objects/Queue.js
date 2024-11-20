export default class Queue {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.queue = [];
    this.pipeKeys = ['pipeStraight', 'pipeCurved', 'pipeCross', 'pipeTee'];
  }
}
