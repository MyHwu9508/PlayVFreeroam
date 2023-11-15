import alt from 'alt-client';
import native from 'natives';
import Clipsets from '../../../shared/conf/Clipsets';

export async function trySetMovementClipset(clipsetKey: string) {
  if (Clipsets[clipsetKey] === undefined || Clipsets[clipsetKey] === '') {
    native.resetPedMovementClipset(localPlayer, 0);
    return;
  }
  await alt.Utils.requestClipSet(Clipsets[clipsetKey], 5000);
  native.setPedMovementClipset(localPlayer, Clipsets[clipsetKey], 0.25);
}
