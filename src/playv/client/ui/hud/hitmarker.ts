import { webView } from '../view/webView';

export function showHitmarker() {
  webView.emit('hitmarker:show');
}
