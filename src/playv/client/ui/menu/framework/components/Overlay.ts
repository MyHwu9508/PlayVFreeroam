import { LocalStorage } from '../../../../systems/localStorage';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

type OverlayTypes = {
  button: string;
  toggle: [string, boolean];
};
export type OverlayInput = Array<OverlayTypes[keyof OverlayTypes]>;

export class Overlay extends BaseComponent {
  type = 'overlay';
  active = false;
  currentIndex = 0;
  private beforeActiveCallbacks: Array<(comp: this) => Promise<void>> = [];
  constructor(public text: string, public inputs: OverlayInput = []) {
    super();
    this.proxiedKeys.push('text', 'inputs', 'currentIndex', 'active');
    this.omittedKeys.push('value', 'beforeActiveCallbacks');
    return this.__getProxy();
  }

  get value() {
    return this.inputs[this.currentIndex];
  }

  onBeforeActive(cb: (comp: this) => Promise<void>) {
    this.beforeActiveCallbacks.push(cb);
    return this;
  }

  async setActive() {
    for (const cb of this.beforeActiveCallbacks) {
      await cb(this);
    }
    if (this.currentIndex > this.inputs.length - 1) this.currentIndex = this.inputs.length - 1;
    this.active = true;
  }

  up(): false | void {
    if (!this.active) return;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', false);
    this.currentIndex = --this.currentIndex < 0 ? this.inputs.length - 1 : this.currentIndex;
    return false;
  }

  down(): false | void {
    if (!this.active) return;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', false);
    this.currentIndex = ++this.currentIndex > this.inputs.length - 1 ? 0 : this.currentIndex;
    return false;
  }

  left(): false | void {
    if (!this.active) return;
    this.active = false;
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    return false;
  }

  back(): false | void {
    if (this.active) {
      this.left();
      return false;
    }
  }

  right(): false | void {
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_LEFT_RIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    if (this.active) {
      if (this.value instanceof Array) {
        this.value[1] = !this.value[1];
      } else {
        this.active = false;
      }
      this.emitInput();
    } else {
      this.setActive();
    }
  }
}
