import alt from 'alt-client';
import { setFocus } from '../focus';
import { webView } from '../view/webView';
import { permissions } from '../../systems/access/permissions';
import { keybindManager } from '../../systems/keybinds';

export async function setUsernameWindowOpen(state: boolean) {
  if (state) {
    await openUsernameWindow();
  } else {
    closeUsernameWindow();
  }
}

async function openUsernameWindow() {
  permissions.setStateActive('uiActive', true);
  keybindManager.isBlocked = true;
  await alt.Utils.waitFor(() => alt.hasMeta('introCompleted'), 10000);
  logDebug('openUsernameWindow');
  webView.emit('setUsernameWindow', true);
  webView.on('usernameSelected', handleUsername);
  setFocus(true, false, true);
}

function handleUsername(name: string) {
  logDebug('handleUsername', name);
  alt.emitServer(`reqSetUsername${alt.Player.local.remoteID}`, name);
}

function closeUsernameWindow() {
  keybindManager.isBlocked = false;
  logDebug('closeUsernameWindow');
  webView.emit('setUsernameWindow', false);
  webView.off('usernameSelected', handleUsername);
  setFocus(false);
  permissions.setStateActive('uiActive', false);
}
