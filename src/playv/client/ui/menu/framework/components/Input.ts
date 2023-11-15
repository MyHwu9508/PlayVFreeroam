import { webView } from '../../../view/webView';
import { menuState } from '../State';
import { BaseComponent } from './BaseComponent';

export class Input extends BaseComponent {
  type = 'input';
  public active = false;
  private finishCallback: ((comp: this, confirm: boolean) => void)[] = [];
  private oldValue: string;
  constructor(public text: string, public value = '', public maxLength = 20) {
    super();
    this.proxiedKeys.push('text', 'value', 'active', 'maxLength');
    this.omittedKeys.push('finishCallback', 'oldValue');
    return this.__getProxy();
  }

  handleInput(input: string) {
    if (!this.active) return;
    this.value = input;
    this.emitInput();
  }

  onFinished(cb: (comp: this, confirm: boolean) => void) {
    this.finishCallback.push(cb);
    return this;
  }

  finish(confirm: boolean) {
    this.active = false;
    if (confirm === false) {
      this.value = this.oldValue;
      this.emitInput();
    }
    webView.off('comp:input', webView.getEventListeners('comp:input')?.[0]);
    webView.off('comp:finish', webView.getEventListeners('comp:finish')?.[0]);
    this.finishCallback.forEach(cb => cb(this, confirm));
    menuState.setInputMode('default');
  }

  right() {
    if (this.active) return;
    this.oldValue = this.value;
    this.active = true;
    menuState.setInputMode('keyboard');
    webView.on('comp:input', this.handleInput.bind(this));
    webView.on('comp:finish', this.finish.bind(this));
  }
}
