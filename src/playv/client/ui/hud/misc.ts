import { webView } from '../view/webView';
import alt from 'alt-client';

export function registerMiscHudEvents() {
  alt.onServer('showKillMessage', showKillMessage);
}

function showKillMessage(action: string, victimName: string) {
  webView.emit('showKillmessage', action, victimName);
}

export function setHudState(state: boolean) {
  webView.emit('hud:toggle', state);
}

export function openURL(url: string) {
  webView.emit('openURL', url);
}
