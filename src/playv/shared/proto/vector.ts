import alt from 'alt-shared';

declare module 'alt-shared' {
  export interface Vector3 {
    randomPositionAround(range: number): alt.Vector3;
    distanceTo2D(compareTo: Vector3): number;
  }
}

alt.Vector3.prototype.randomPositionAround = function randomPositionAround(range) {
  return new alt.Vector3(this.x + Math.random() * (range * 2) - range, this.y + Math.random() * (range * 2) - range, this.z);
};

alt.Vector3.prototype.distanceTo2D = function distanceTo2D(compareTo: alt.Vector3) {
  return Math.sqrt(Math.pow(compareTo.x - this.x, 2) + Math.pow(compareTo.y - this.y, 2));
};
