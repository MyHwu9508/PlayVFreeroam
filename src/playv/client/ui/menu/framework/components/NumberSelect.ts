import { LocalStorage } from '../../../../systems/localStorage';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

export class NumberSelect extends BaseComponent {
  type = 'numberSelect';
  canHold = true;
  constructor(public text: string, public min = 0, public max = 100, public step = 1, public value = 0) {
    super();
    this.proxiedKeys.push('text', 'min', 'max', 'step', 'value');
    return this.__getProxy();
  }

  roundValue() {
    this.value = Math.round(this.value * 1000) / 1000;
  }

  right() {
    this.value += this.step;
    this.roundValue();
    if (this.value > this.max) this.value = this.min;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.emitInput();
  }

  left(): false {
    this.value -= this.step;
    this.roundValue();
    if (this.value < this.min) this.value = this.max;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.emitInput();
    return false;
  }
}
