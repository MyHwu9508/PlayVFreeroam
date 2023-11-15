import alt from 'alt-shared';

/*
 * Info for GTAV Rotation
 * X: Pitch; Y: Roll; Z: Yaw
 * X: LEFT/RIGHT; Y: FORWARD/BACKWARD; Z: UP/DOWN
 */

function moveForward(pos: alt.Vector3, rot: alt.Vector3, distance: number) {
  return moveRelative(pos, new alt.Vector3(0, distance, 0), rot);
}

export function moveRelative(pos: alt.Vector3, move: alt.Vector3, rot: alt.Vector3) {
  const radRot = rot.toRadians();
  const cos = new alt.Vector3(Math.cos(radRot.x), Math.cos(radRot.y), Math.cos(radRot.z));
  const sin = new alt.Vector3(Math.sin(radRot.x), Math.sin(radRot.y), Math.sin(radRot.z));
  let moveVector = new alt.Vector3(move.x, move.y, move.z);
  // Roll Rotation
  moveVector = new alt.Vector3(moveVector.x * cos.y + moveVector.z * sin.y, moveVector.y, moveVector.z * cos.y - moveVector.x * sin.y);
  //Pitch Rotation
  moveVector = new alt.Vector3(moveVector.x, moveVector.y * cos.x - moveVector.z * sin.x, moveVector.z * cos.x + moveVector.y * sin.x);
  //Yaw Rotation
  moveVector = new alt.Vector3(moveVector.x * cos.z - moveVector.y * sin.z, moveVector.x * sin.z + moveVector.y * cos.z, moveVector.z);
  const newPos = new alt.Vector3(pos.x + moveVector.x, pos.y + moveVector.y, pos.z + moveVector.z);
  return newPos;
}

function dotProduct(a: alt.Vector3, b: alt.Vector3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
/**
 * Gets the intersection of a ray and a sphere
 * @param pos Position of the ray
 * @param rot Direction of the ray
 * @param center Position of the sphere
 * @param radius Radius of the sphere
 * @returns undefined if no intersection, otherwise the intersection point
 */
function isLookingAtSphere(pos: alt.Vector3, rot: alt.Vector3, center: alt.Vector3, radius: number): undefined | alt.Vector3 {
  const forward = rotationToUnitVector(rot);
  const Q = pos.sub(center);
  const a = dotProduct(forward, forward);
  const b = 2 * dotProduct(forward, Q);
  const c = dotProduct(Q, Q) - radius * radius;
  const d = b * b - 4 * a * c;
  if (d < 0 || b >= 0) return undefined;
  const [, t2] = quadraticSolve(a, b, c);
  return pos.add(forward.mul(t2));
}

function quadraticSolve(a: number, b: number, c: number): [number | undefined, number | undefined] {
  const d = b * b - 4 * a * c;
  if (d < 0) return [undefined, undefined];
  if (d === 0) return [-b / (2 * a), undefined];
  return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
}

function rotationToUnitVector(vector: alt.Vector3) {
  return moveForward(new alt.Vector3(0, 0, 0), vector, 1);
}

function getRoundedString(vector: alt.Vector3 | { x: number; y: number; z: number }, decimals: number = 2) {
  return `[x: ${parseFloat(vector.x.toFixed(decimals))}, y: ${parseFloat(vector.y.toFixed(decimals))}, z: ${parseFloat(vector.z.toFixed(decimals))}]`;
}

export const vector = {
  moveForward,
  moveRelative,
  dotProduct,
  isLookingAtSphere,
  quadraticSolve,
  rotationToUnitVector,
  getRoundedString,
};
