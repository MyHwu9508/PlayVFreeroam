import _ from 'lodash';
import { webView } from '../../view/webView';
import { setFocus } from '../../focus';
const activeModals: Record<string, (...args: unknown[]) => void> = {};

webView.on('modal:close', (id: string, ...args: unknown[]) => {
  if (activeModals[id]) {
    activeModals[id](...args);
    delete activeModals[id];
    if (Object.keys(activeModals).length === 0) {
      setFocus(false);
    }
  }
});

export function showTextArea(title: string, text: string, editable = false) {
  return new Promise(resolve => {
    const id = _.uniqueId('mta');
    webView.emit('modal:textArea', title, text, editable, id);
    setFocus(true, true, true);
    activeModals[id] = resolve;
  });
}
