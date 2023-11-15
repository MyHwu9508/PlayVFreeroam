import { LocalStorage } from '../../../../systems/localStorage';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

export class Confirm extends BaseComponent {
  type = 'confirm';
  active = false;
  constructor(public text: string, public confirm: string, public color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'surface' = 'secondary') {
    super();
    this.proxiedKeys.push('text', 'color', 'confirm', 'active');
    return this.__getProxy();
  }

  private activeTimeout: NodeJS.Timeout;
  right(): false | void {
    if (this.active) {
      if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
      this.emitInput();
      clearTimeout(this.activeTimeout);
      this.active = false;
      this.activeTimeout = undefined;
    } else {
      if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
      this.active = true;
      this.activeTimeout = setTimeout(() => {
        this.active = false;
      }, 3000);
    }
  }

  left(): false | void {
    if (this.active) {
      this.active = false;
      clearTimeout(this.activeTimeout);
      return false;
    }
  }
}
