import { clone } from 'lodash';

export function replaceNestedArrays(obj: Object, keys: string[][]) {
  const newObj = clone(obj);
  for (const key of keys) {
    let accessor = newObj;
    for (let i = 0; i < key.length; i++) {
      const property = key[i];
      if (i === key.length - 1) {
        accessor[property] = Array.isArray(accessor[property]) ? [] : {};
      } else {
        accessor[property] = clone(accessor[property]);
        accessor = accessor[property];
      }
    }
  }
  return newObj;
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
