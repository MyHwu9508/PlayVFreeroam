import { LocalStorage } from '../../../../systems/localStorage';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

export class Select extends BaseComponent {
  type = 'select';
  canHold = true;
  constructor(public text: string, public options: string[], public index = 0) {
    super();
    this.proxiedKeys.push('text', 'options', 'index');
    this.omittedKeys.push('value');
    return this.__getProxy();
  }

  right() {
    if (++this.index > this.options.length - 1) this.index = 0;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.emitInput();
  }

  left(): false {
    if (--this.index < 0) this.index = this.options.length - 1;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.emitInput();
    return false;
  }

  get value() {
    return this.options[this.index];
  }

  set value(value: string) {
    this.index = this.options.indexOf(value);
  }
}
