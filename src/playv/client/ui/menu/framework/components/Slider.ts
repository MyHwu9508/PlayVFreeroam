import { LocalStorage } from '../../../../systems/localStorage';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

export class Slider extends BaseComponent {
  type = 'slider';
  canHold = true;
  constructor(public text: string, public min = 0, public max = 100, public step = 1, public value = 0) {
    super();
    this.proxiedKeys.push('text', 'min', 'max', 'step', 'value');
    return this.__getProxy();
  }

  right(): false | void {
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.value = Math.min(this.value + this.step, this.max);
    this.emitInput();
    return false;
  }

  left(): false | void {
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.value = Math.max(this.value - this.step, this.min);
    this.emitInput();
    return false;
  }

  generateContext(valueDigits = 2) {
    this.context = `<div class="w-full flex text-center" style="justify-content: space-evenly;"><span>Min: ${this.min}</span><span>Current: ${this.value.toFixed(
      valueDigits
    )}</span><span>Max: ${this.max}</span></div>`;
    return this;
  }
}
