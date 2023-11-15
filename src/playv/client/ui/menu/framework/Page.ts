import type { colord } from 'colord';
import { menuState } from './State';
import { BaseComponent } from './components/BaseComponent';
import { Button } from './components/Button';
import { Confirm } from './components/Confirm';
import { Input } from './components/Input';
import { Overlay, OverlayInput } from './components/Overlay';
import { PageLink } from './components/PageLink';
import { Select } from './components/Select';
import { Slider } from './components/Slider';
import { Toggle } from './components/Toggle';
import { ColorPicker } from './components/ColorPicker';
import { NumberSelect } from './components/NumberSelect';
import { permissions } from '../../../systems/access/permissions';
import { KeybindButton } from './components/KeybindButton';
import DefaultKeybinds from '../../../../shared/conf/DefaultKeybinds';

export class Page {
  private openCallbacks: ((page: this) => void)[] = [];
  private beforeOpenCallbacks: ((page: this) => Promise<void> | void)[] = [];
  private closeCallbacks: ((page: this) => void)[] = [];
  private components: BaseComponent[] = [];
  public lastIndex = 0;
  permission: string | undefined;
  get can() {
    return !this.permission || permissions.can(this.permission);
  }

  constructor(public title: string) {}

  onOpen(callback: (page: this) => void) {
    this.openCallbacks.push(callback);
  }

  onBeforeOpen(callback: (page: this) => Promise<void> | void) {
    this.beforeOpenCallbacks.push(callback);
  }

  onClose(callback: (page: this) => void) {
    this.closeCallbacks.push(callback);
  }

  open() {
    this.openCallbacks.forEach((callback) => callback(this));
  }

  async beforeOpen() {
    for (const callback of this.beforeOpenCallbacks) {
      await callback(this);
    }
  }

  close() {
    this.closeCallbacks.forEach((callback) => callback(this));
  }

  addComponent<T extends BaseComponent>(component: T) {
    const prevCount = this.components.length;
    this.components.push(component);
    if (menuState.currentPage === this) {
      menuState.refreshMaxIndex();
      if (prevCount === 0) menuState.setComponentIndex(0);
    }
    return component;
  }

  addComponents<T extends BaseComponent>(...components: T[]) {
    this.components.push(...components);
    menuState.refreshMaxIndex();
  }

  getComponent(index: number) {
    return this.components[index];
  }

  getComponentById(id: string) {
    return this.components.find((component) => component.id === id);
  }

  removeComponent(index: number) {
    this.components.splice(index, 1);
    menuState.refreshMaxIndex();
  }

  removeComponentById(id: string) {
    const index = this.components.findIndex((component) => component.id === id);
    if (index !== -1) this.removeComponent(index);
  }

  removeComponentsAfter(index: number) {
    this.components.splice(index + 1);
    menuState.refreshMaxIndex();
  }

  removeComponentsAfterById(id: string) {
    const index = this.components.findIndex((component) => component.id === id);
    if (index !== -1) this.removeComponentsAfter(index);
  }

  get maxIndex() {
    return this.components.length - 1;
  }

  //Component Functions
  addLink(text: string, href: string) {
    return this.addComponent(new PageLink(text, href));
  }

  addToggle(text: string, value = false, style: Toggle['style'] = 'checkbox') {
    return this.addComponent(new Toggle(text, value, style));
  }

  addSlider(text: string, min = 0, max = 100, step = 1, value = 0) {
    return this.addComponent(new Slider(text, min, max, step, value));
  }

  addButton(
    text: string,
    color:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'success'
      | 'warning'
      | 'error'
      | 'surface'
      | 'white'
      | 'black' = 'white',
  ) {
    return this.addComponent(new Button(text, color));
  }

  addConfirm(
    text: string,
    confirm = 'Are you sure?',
    color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'surface' = 'secondary',
  ) {
    return this.addComponent(new Confirm(text, confirm, color));
  }

  addSelect(text: string, options: string[], value?: string) {
    return this.addComponent(new Select(text, options, options.indexOf(value) !== -1 ? options.indexOf(value) : 0));
  }

  addNumberSelect(text: string, min: number, max: number, step = 1, value = min) {
    return this.addComponent(new NumberSelect(text, min, max, step, value));
  }

  addOverlay(text: string, inputs: OverlayInput = []) {
    return this.addComponent(new Overlay(text, inputs));
  }

  addInput(text: string, value = '', maxLength = 20) {
    return this.addComponent(new Input(text, value, maxLength));
  }

  addColorPicker(text: string, value: Parameters<typeof colord>[number] = '#000000') {
    return this.addComponent(new ColorPicker(text, value));
  }

  addKeybindButton(text: string, keybind: keyof typeof DefaultKeybinds) {
    return this.addComponent(new KeybindButton(text, keybind));
  }
}
