import alt from 'alt-client';
import native from 'natives';

export function hideAllHudComponentsThisFrame() {
  for (let i = 0; i < 23; i++) {
    native.hideHudComponentThisFrame(i);
    native.hideHudAndRadarThisFrame();
  }
}
