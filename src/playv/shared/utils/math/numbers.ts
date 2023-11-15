export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export function getRandomBool() {
  return Math.random() >= 0.5;
}
export function generateExponentialRandom(min: number = 0, max: number = 1) {
  const random = Math.random();
  return Math.pow(random, 2) * (max - min) + min;
}

export function randomNormal() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randomNormal(); // resample between 0 and 1
  return num;
}
