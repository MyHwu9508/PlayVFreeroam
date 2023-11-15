import alt from 'alt-client';
import native from 'natives';
import { ConVar } from '../../../shared/conf/ConVars';

export async function playIntro() {
  if (ConVar.DEBUG.FAST_LOGIN) {
    alt.logDebug('INTRO, skipping intro');
    alt.setMeta('introCompleted', true);
    native.doScreenFadeIn(100);
    return;
  }

  await new Promise(resolve => {
    alt.logDebug('INTRO, starting intro');
    const loginIntroWebView = new alt.WebView('http://resource/client/html/intro/intro.html');
    loginIntroWebView.on('cef:ready', () => {
      alt.logDebug('INTRO, cef:ready');
      native.doScreenFadeIn(100);
      alt.setTimeout(() => {
        if (loginIntroWebView.valid) loginIntroWebView.destroy();
        alt.setMeta('introCompleted', true);
        resolve(true);
      }, 2100);
    });
  });
}
