import * as native from 'natives';

export function getMaxOverlayIndece() {
  const maxIdece: number[] = [];
  for (let i = 0; i < 12; i++) {
    maxIdece.push(native.getPedHeadOverlayNum(i) - 1);
  }
  return maxIdece;
}
