import alt from 'alt-client';
import { webView } from '../view/webView';

export async function setFloatingButtons(buttons: Array<[string, string]>) {
  await alt.Utils.waitFor(() => alt.getMeta('introCompleted'), 50000);
  webView.emit('refreshHelpButtons', buttons);
}
