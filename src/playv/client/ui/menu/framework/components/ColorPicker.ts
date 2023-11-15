import { Colord, colord } from 'colord';
import { webView } from '../../../view/webView';
import { menuState } from '../State';
import { BaseComponent } from './BaseComponent';

export class ColorPicker extends BaseComponent {
  type = 'color';
  public active = false;
  private finishCallback: ((comp: this, confirm: boolean) => void)[] = [];
  hex: string;
  private oldHex: string;
  constructor(public text: string, color: Parameters<typeof colord>[number], public alpha = false) {
    super();
    this.hex = colord(color).toHex();
    this.proxiedKeys.push('text', 'hex', 'active', 'value');
    this.omittedKeys.push('finishCallback', 'oldHex', 'value');
    return this.__getProxy();
  }

  get value(): Colord {
    return colord(this.hex);
  }

  set value(color: Parameters<typeof colord>[number]) {
    this.hex = colord(color).toHex();
  }

  handleInput(input: string) {
    if (!this.active) return;
    this.hex = input;
    this.emitInput();
  }

  onFinished(cb: (comp: this, confirm: boolean) => void) {
    this.finishCallback.push(cb);
    return this;
  }

  finish(confirm: boolean) {
    this.active = false;
    if (confirm === false) {
      this.hex = this.oldHex;
      this.emitInput();
    }
    webView.off('comp:input', webView.getEventListeners('comp:input')?.[0]);
    webView.off('comp:finish', webView.getEventListeners('comp:finish')?.[0]);
    this.finishCallback.forEach(cb => cb(this, confirm));
    setTimeout(() => menuState.setInputMode('default'), 100);
  }

  right() {
    if (this.active) return;
    this.oldHex = this.hex;
    this.active = true;
    menuState.setInputMode('cursor');
    webView.on('comp:input', this.handleInput.bind(this));
    webView.on('comp:finish', this.finish.bind(this));
  }
}
