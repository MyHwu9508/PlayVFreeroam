import { LocalStorage } from '../../../../systems/localStorage';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

export class Toggle extends BaseComponent {
  type = 'toggle';
  constructor(public text: string, public value = false, public style: [string, string] | 'checkbox' | 'switch' | 'play' = 'checkbox') {
    super();
    this.proxiedKeys.push('text', 'style', 'value');
    return this.__getProxy();
  }

  right(): false | void {
    this.value = !this.value;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.emitInput();
    return false;
  }
}
