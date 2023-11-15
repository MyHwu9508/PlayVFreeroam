import { LocalStorage } from '../../../../systems/localStorage';
import { BaseComponent } from './BaseComponent';
import native from 'natives';

export class Button extends BaseComponent {
  type = 'button';
  font: string;
  size: number;
  line = false;
  lineColor: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'surface' | 'white' | 'black' | undefined;
  trailing: string | undefined;
  constructor(public text: string, public color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'surface' | 'white' | 'black' = 'white') {
    super();
    this.proxiedKeys.push('text', 'color', 'font', 'size', 'line', 'lineColor', 'trailing');
    return this.__getProxy();
  }

  addConfig(config: Partial<Pick<Button, 'color' | 'font' | 'size' | 'line' | 'lineColor' | 'trailing'>>) {
    Object.assign(this, config);
    return this;
  }

  right(): false | void {
    if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    this.emitInput();
    return false;
  }
}
