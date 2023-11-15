import alt from 'alt-shared';

declare module 'alt-shared' {
  export interface BaseObject {
    inFront(distance: number): alt.Vector3;
  }
}

alt.BaseObject.prototype.inFront = function inFront(distance: number) {
  const num = Math.abs(Math.cos(this.rot.x));
  const forward = {
    x: -Math.sin(this.rot.z) * num,
    y: Math.cos(this.rot.z) * num,
    z: Math.sin(this.rot.x),
  };

  return new alt.Vector3(this.pos.x + forward.x * distance, this.pos.y + forward.y * distance, this.pos.z + forward.z * distance);
};
