import alt from 'alt-client';
import { webView } from '../view/webView';
import { gtaHud } from '../../utils/gtaHud';
import { KillFeedAnchors, KillFeedEntry } from '../../../shared/types/types';
import { LocalStorage } from '../../systems/localStorage';

export function registerKillfeed() {
  if (!LocalStorage.get('killfeed')) return;
  alt.onServer('pushKillfeed', (killfeedentry: KillFeedEntry) => {
    logDebug(`pushKillfeed ${killfeedentry.killerName} ${killfeedentry.imageName} ${killfeedentry.victimName}`);
    webView.emit('pushKillfeed', killfeedentry);
  });
}

export function updateKillFeedAnchors() {
  const anchors: KillFeedAnchors = {
    top: gtaHud.getMinimapTopLeft().y,
    width: gtaHud.getMinimapWidth(),
    left: gtaHud.getMinimapTopLeft().x,
  };
  webView.emit('updateKillFeedAnchors', anchors);
}
