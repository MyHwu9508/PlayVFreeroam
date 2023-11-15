import alt from 'alt-client';
import native from 'natives';

export function processFadeIn(entity: alt.Entity) {
  let currentAlpha = 0;
  const interval = alt.setInterval(() => {
    if (entity?.valid) {
      currentAlpha += 30;
      if (currentAlpha >= 255) {
        native.resetEntityAlpha(entity.scriptID);
        alt.clearInterval(interval);
        return;
      }
      native.setEntityAlpha(entity.scriptID, currentAlpha, false);
    } else {
      alt.clearInterval(interval);
    }
  }, 30);
}
