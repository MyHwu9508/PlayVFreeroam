import alt from 'alt-client';
import { webView } from '../../view/webView';
import { setFocus } from '../../focus';

export async function openLoginHelpWindow() {
  webView.emit('discord:openHelpWindow');
  setFocus(true, false, true);
}

export async function openFallbackWindow(url: string) {
  webView.emit('discord:openFallbackWindow', url);
  setFocus(true, false, true);
}

export async function hideHelpWindows() {
  webView.emit('discord:hideHelpWindows');
  setFocus(false);
}
