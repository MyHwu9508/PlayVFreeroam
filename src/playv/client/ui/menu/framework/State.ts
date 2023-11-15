import alt from 'alt-client';
import native from 'natives';
import type { Page } from './Page';
import type { BaseComponent } from './components/BaseComponent';
import { Menu } from './Menu';
import { webView } from '../../view/webView';
import { setFocus } from '../../focus';
import { keybindManager } from '../../../systems/keybinds';
import { permissions } from '../../../systems/access/permissions';
import { LocalStorage } from '../../../systems/localStorage';

type Input = 'left' | 'right' | 'up' | 'down' | 'enter' | undefined;

class State {
  private menu: Menu;
  currentPage: Page;
  currentComponent: BaseComponent;
  currentPath: string;
  componentIndex: number;
  inputMode = 'default';
  isVisible: boolean = false;
  webViewReady: boolean = false;

  constructor() {
    this.currentPage = null;
    this.componentIndex = 0;
    this.currentComponent = null;
    alt.everyTick(this.tick.bind(this));
    webView.on('comp:get', (index: number) => {
      webView.emit('comp:set', index, this.currentPage.getComponent(index)?.getCleanComponent());
    });
    webView.on('comp:getContext', (id: string) => {
      const comp = this.currentPage.getComponentById(id);
      if (!comp) return;
      webView.emit('comp:setContext', id, comp.__isProxy ? comp.__bypass.context : comp.context);
    });
  }

  async setCurrentPage(page: Page) {
    if (!page.can) return;
    this.currentPage?.close();
    await page?.beforeOpen();
    page?.open();
    this.currentPage = page;
    webView.emit('menu:setMaxIndex', page.maxIndex);
    webView.emit('menu:setTitle', page.title);
  }

  setMenu(menu: Menu) {
    this.menu = menu;
  }

  refreshMaxIndex() {
    if (!this.currentPage) return;
    webView.emit('menu:setMaxIndex', this.currentPage.maxIndex);
    this.setComponentIndex(Math.min(this.componentIndex, this.currentPage.maxIndex), 0);
    this.refreshComponents();
  }

  applySettings(side: 'left' | 'right', maxElements: number, x: number, y: number, width: number, scale: number) {
    scale = 1 / scale;
    webView.emit('menu:applySettings', side, maxElements, x, y, width, scale);
  }

  refreshComponents() {
    webView.emit('comp:refresh');
  }

  setInputMode(mode: 'default' | 'keyboard' | 'cursor') {
    webView.emit('menu:setInputMode', mode);
    this.inputMode = mode;
    switch (mode) {
      case 'default':
        setFocus(false);
        keybindManager.isBlocked = false;
        break;
      case 'keyboard':
        setFocus(true, false, true, false);
        keybindManager.isBlocked = true;
        break;
      case 'cursor':
        setFocus(true, true, true, true);
        keybindManager.isBlocked = true;
        break;
    }
  }

  setVisibility(visible: boolean) {
    if (visible) {
      if (!permissions.can('ui.menu')) return;
    }
    this.isVisible = visible;
    webView.emit('menu:setVisibility', visible);
    if (visible) {
      if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
      this.currentPage?.open();
    } else {
      if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'Back', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
      this.currentPage?.close();
      if (this.inputMode !== 'default') this.setInputMode('default');
      this.clearInput();
    }
    permissions.setStateActive('uiActive', visible);
  }

  async setPath(path: string) {
    if (this.menu.hasPage(path)) {
      await this.setCurrentPage(this.menu.getPage(path));
      this.setComponentIndex(Math.min(Math.max(this.currentPage.lastIndex, 0), this.currentPage.maxIndex), 0);
      this.currentPath = path;
    } else logError('menu', `Page with path ${path} does not exist!`);
  }

  setComponentIndex(index: number, animateDuration = 0) {
    if (index < 0) index = this.currentPage.maxIndex;
    if (index > this.currentPage.maxIndex) index = 0;
    this.componentIndex = index;
    this.currentPage.lastIndex = index;
    this.currentComponent = this.currentPage.getComponent(index);
    webView.emit('menu:setCurrentIndex', this.componentIndex, animateDuration);
  }

  traceBackPath() {
    const parts = this.currentPath.split('/');
    while (parts.length > 1) {
      parts.pop();
      const newPath = parts.join('/');
      if (this.menu.hasPage(newPath)) {
        this.setPath(newPath);
        return;
      }
    }
    this.setPath('/');
  }

  private activeInput: Input;
  private inputTimeout: number | undefined;
  private inputStart: number;

  clearInput() {
    this.activeInput = undefined;
    if (this.inputTimeout) {
      alt.clearTimeout(this.inputTimeout);
      this.inputTimeout = undefined;
    }
  }

  startInput(input: Input) {
    if (this.inputTimeout) this.clearInput();
    this.activeInput = input;
    this.handleInput();
    if (input === 'up' || input === 'down' || this.currentComponent?.canHold) {
      this.inputStart = Date.now();
      this.startTimeout();
    } else {
      this.activeInput = undefined;
    }
  }

  startTimeout() {
    this.inputTimeout = alt.setTimeout(() => {
      this.handleInput();
      this.startTimeout();
    }, this.getInputTimeout());
  }

  getInputTimeout(): number {
    const activeDuration = Date.now() - this.inputStart;
    return Math.max(250 - activeDuration / 15, 20);
  }

  handleInput() {
    const res = this.currentComponent?.input(this.activeInput);
    if (res === false) return;
    switch (this.activeInput) {
      case 'up':
        if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
        this.setComponentIndex(this.componentIndex - 1, this.getInputTimeout());
        break;
      case 'down':
        this.setComponentIndex(this.componentIndex + 1, this.getInputTimeout());
        if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
        break;
      case 'left':
        this.handleGoBack();
        break;
      case 'enter':
        this.currentComponent?.input('right');
        break;
    }
  }

  async handleGoBack() {
    if (this.activeInput !== undefined) this.clearInput();
    if (native.isDisabledControlJustPressed(0, 200)) {
      //ESC Key
      await alt.Utils.waitFor(() => native.isDisabledControlJustReleased(0, 200), 5000);
      this.setVisibility(false);
      return;
    }
    const res = this.currentComponent?.input('back');
    if (res === false) return;
    if (this.currentPath !== '/') {
      this.traceBackPath();
      if (LocalStorage.get('menuSounds')) native.playSoundFrontend(-1, 'BACK', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    } else this.setVisibility(false);
  }

  private tick() {
    if (!alt.isGameFocused() || !this.isVisible) {
      if (this.activeInput !== undefined) this.clearInput();
    }
    if (!native.isUsingKeyboardAndMouse(0)) {
      native.disableControlAction(0, 27, true); // DPAD UP > Menu Open
      native.disableControlAction(0, 75, true); // Y > Menu Close
      if (native.isDisabledControlJustReleased(0, 27)) {
        if (!this.isVisible) this.setVisibility(true);
      }
      if (native.isDisabledControlJustReleased(0, 75)) {
        if (this.isVisible) this.setVisibility(false);
      }
      if (this.isVisible) {
        native.disableControlAction(0, 14, true); //Weapon Wheel
        native.disableControlAction(0, 15, true); //Weapon Wheel
        native.disableControlAction(0, 74, true); //Headlight
        native.disableControlAction(0, 85, true); //Radiowheel
        native.disableControlAction(0, 80, true); //CINema cam
      }
    }
    if (!this.isVisible) return;
    native.disableControlAction(0, 188, true); // Up
    native.disableControlAction(0, 187, true); // Down
    native.disableControlAction(0, 189, true); // Left
    native.disableControlAction(0, 190, true); // Right
    native.disableControlAction(0, 200, true); // Pause
    native.disableControlAction(0, 202, true); // Backspace
    native.disableControlAction(0, 201, true); // Enter

    if (native.isDisabledControlJustReleased(0, 188) && this.activeInput === 'up') this.clearInput();
    if (native.isDisabledControlJustReleased(0, 187) && this.activeInput === 'down') this.clearInput();
    if (native.isDisabledControlJustReleased(0, 189) && this.activeInput === 'left') this.clearInput();
    if (native.isDisabledControlJustReleased(0, 190) && this.activeInput === 'right') this.clearInput();
    if (native.isDisabledControlJustReleased(0, 201) && this.activeInput === 'enter') this.clearInput();
    if (this.inputMode !== 'default' || this.activeInput !== undefined) return;
    if (native.isDisabledControlJustPressed(0, 188)) return this.startInput('up');
    if (native.isDisabledControlJustPressed(0, 187)) return this.startInput('down');
    if (native.isDisabledControlJustPressed(0, 189)) return this.startInput('left');
    if (native.isDisabledControlJustPressed(0, 190)) return this.startInput('right');
    if (native.isDisabledControlJustPressed(0, 201)) return this.startInput('enter');
    if (native.isDisabledControlJustPressed(0, 202)) return this.handleGoBack();
  }
}

export const menuState = new State();
export const menu = new Menu(menuState);
menuState.setMenu(menu);
export type MenuState = State;
