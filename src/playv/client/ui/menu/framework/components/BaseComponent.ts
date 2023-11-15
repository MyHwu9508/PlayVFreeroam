import _ from 'lodash';
import { ObserverCallback, createObserverProxy } from '../Proxy';
import { ComponentContext } from '../types';
import { webView } from '../../../view/webView';
import { menuState } from '../State';
import { permissions } from '../../../../systems/access/permissions';

export abstract class BaseComponent {
  declare __isProxy: true | undefined;
  declare __bypass: this | undefined;
  omittedKeys: string[] = ['context', 'omittedKeys', 'inputCallbacks', 'proxiedKeys', 'canHold', 'enterCallbacks'];
  proxiedKeys: string[] = ['context', 'disabled', 'selected'];
  id = _.uniqueId('c');
  canHold = false;
  permission: string | undefined;
  protected _disabled = false;
  private inputCallbacks: Array<(comp: this) => void> = [];
  context: ComponentContext;
  abstract text: string;
  abstract type: string;
  left(): void | false {}
  leftHold(): void | false {}
  right(): void | false {}
  rightHold(): void | false {}
  enter(): void | false {}
  back(): void | false {}
  up(): void | false {}
  down(): void | false {}

  input(direction: 'left' | 'right' | 'enter' | 'back' | 'up' | 'down') {
    if (!this.can) return;
    switch (direction) {
      case 'left':
        return this.left();
      case 'right':
        return this.right();
      case 'enter':
        return this.enter();
      case 'back':
        return this.back();
      case 'up':
        return this.up();
      case 'down':
        return this.down();
    }
  }

  getCleanComponent() {
    if (!this.can) return { type: 'disabled', text: this.text, id: this.id };
    const withoutFunctions = _.omitBy(this.__isProxy ? this.__bypass : this, v => typeof v === 'function');
    return _.omit(withoutFunctions, this.omittedKeys);
  }
  protected observerCallback: ObserverCallback = _.debounce(() => {
    webView.emit('comp:setContext', this.id, this.__isProxy ? this.__bypass.context : this.context);
    webView.emit('comp:set', this.id, this.getCleanComponent());
  }, 10);

  get selected() {
    return menuState.currentComponent?.id === this.id;
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    webView.emit('comp:set', this.id, this.getCleanComponent());
  }

  get can() {
    return !(this.disabled || (this.permission && !permissions.can(this.permission)));
  }

  __getProxy() {
    return createObserverProxy(this, this.observerCallback.bind(this));
  }

  addContext(context: ComponentContext) {
    this.context = context;
    return this;
  }

  addPermission(permission: string) {
    this.permission = permission;
    return this;
  }

  addThrottle(timeout: number) {
    this.emitInput = _.throttle(this.emitInput, timeout);
    return this;
  }

  onInput(callback: (comp: this) => void) {
    this.inputCallbacks.push(callback);
    return this;
  }

  emitInput() {
    this.inputCallbacks.forEach(cb => cb(this.__isProxy ? this : this.__getProxy()));
  }
}
