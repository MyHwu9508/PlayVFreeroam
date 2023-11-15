export const SEATING_POSITION = {
  x: 952.75,
  y: 16.65,
  z: 116.64,
  heading: 25,
};

export const CAMERA_POSITION = {
  x: SEATING_POSITION.x + 0.29,
  y: SEATING_POSITION.y - 0.73,
  z: SEATING_POSITION.z + 1.25,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
};

export const MAX_PEDLOOK_ANGLE = {
  x: 65,
  y: 35,
};

export const CAMERA_FOVBOUNDS = {
  min: 12,
  max: 75,
};

export const CAMERA_PRESETS = [
  { x: 106, y: 8, fov: 15 },
  { x: 20, y: -32, fov: 26 },
  { x: 200, y: 2, fov: 26 },
  { x: -164, y: 8, fov: 15 },
  { x: -74, y: 8, fov: 15 },
];
