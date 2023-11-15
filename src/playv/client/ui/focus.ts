import alt from 'alt-client';
import { webView } from './view/webView';

let oldMousePos = new alt.Vector2(0.5, 0.5);
let controlsBlocked = false;
let mouseIsShown = false;

export function setFocus(state: boolean, reuseOldMousePos = false, blockControls = false, showCursor = true) {
  if (state) {
    webView.focus();
    if (showCursor) {
      alt.showCursor(true);
      mouseIsShown = true;
    }

    if (reuseOldMousePos) {
      alt.setCursorPos(oldMousePos);
    }

    if (blockControls) {
      controlsBlocked = true;
      alt.toggleGameControls(false);
    }
  } else {
    webView.unfocus();
    if (mouseIsShown) {
      mouseIsShown = false;
      alt.showCursor(false);
      oldMousePos = alt.getCursorPos();
    } else {
      logDebug('Cursor was not visible, not saving old mouse pos');
    }
    if (controlsBlocked) {
      controlsBlocked = false;
      alt.toggleGameControls(true);
    }
  }
  alt.setMeta('hasWebviewFocus', state);
}
