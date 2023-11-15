import alt from 'alt-client';
import { webView } from '../../view/webView';
import { setFocus } from '../../focus';
import { keybindManager } from '../../../systems/keybinds';

export async function openRegisterWindow() {
  setFocus(true, false, true);
  keybindManager.isBlocked = true;
  webView.emit('register:openWindow', true);
  return new Promise(resolve => {
    webView.once('continueWithLogin', () => {
      log('login', `User registered, continue with login...`);
      keybindManager.isBlocked = false;
      setFocus(false);
      return resolve(true);
    });
  });
}
