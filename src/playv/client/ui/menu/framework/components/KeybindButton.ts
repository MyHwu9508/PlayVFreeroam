import DefaultKeybinds from '../../../../../shared/conf/DefaultKeybinds';
import { KEYNAMES } from '../../../../../shared/data/keycodes';
import { keybindManager } from '../../../../systems/keybinds';
import { pushToast } from '../../../hud/toasts';
import { Button } from './Button';

export class KeybindButton extends Button {
  constructor(text: string, public keybind: keyof typeof DefaultKeybinds) {
    super(text);
    this.trailing = this.keyName;
    this.omittedKeys.push('keybind', 'keyName');
    this.lineColor = 'secondary';

    const proxy = this.__getProxy();
    proxy.onInput(async comp => {
      const oldKey = this.keyName;
      try {
        comp.trailing = 'Press a key...';
        comp.line = true;
        const newKey = await keybindManager.changeKeybind(this.keybind);
        comp.trailing = KEYNAMES[newKey];
      } catch (e) {
        comp.trailing = oldKey;
        pushToast('error', e);
      } finally {
        comp.line = false;
      }
    });

    return proxy;
  }

  get keyName() {
    const code = keybindManager.getCurrentKeybind(this.keybind);
    return KEYNAMES[code];
  }
}
