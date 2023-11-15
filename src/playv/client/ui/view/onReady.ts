import alt from 'alt-client';
import { webView } from './webView';
import { menuState } from '../menu/framework/State';
import { Theme } from '../../systems/themeChanger';
import { updateMenuSettings } from '../menu/pages/Misc/MenuSettings';

webView.on('ready', () => {
  alt.setMeta('webViewReady', true);
  menuState.setPath('/');
  Theme.updateTheme();
  updateMenuSettings();
  log('hud', 'Webview ready');
});
