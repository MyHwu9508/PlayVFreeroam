import { webView } from '../view/webView';

export function setShowMicIcon(state: boolean) {
  webView.emit('showMicIcon', state);
}
