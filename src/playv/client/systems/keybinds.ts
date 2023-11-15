import DefaultKeybinds from '../../shared/conf/DefaultKeybinds';
import { LocalStorage } from './localStorage';
import alt from 'alt-client';

type KeyEvent = 'keydown' | 'keyup';

class KeybindManager {
  private keydownEvents: Record<string, () => void> = {};
  private keyupEvents: Record<string, () => void> = {};
  isBlocked = false;

  constructor() {
    this.registerAltEvents();
  }

  private registerAltEvents() {
    alt.on('keydown', key => this.handleKeyPressed(key, 'keydown'));
    alt.on('keyup', key => this.handleKeyPressed(key, 'keyup'));
  }

  private handleKeyPressed(key: number, pressType: KeyEvent) {
    if (alt.isConsoleOpen()) return; //block all keys when console is open (F8)
    if (this.isBlocked) return;

    const keybinds = LocalStorage.get('keybinds');

    let eventName = Object.keys(keybinds).find(x => keybinds[x] === key);
    if (!eventName) {
      const defaultEventName = Object.keys(DefaultKeybinds).find(x => DefaultKeybinds[x] === key);
      if (!keybinds[defaultEventName]) eventName = defaultEventName;
    }

    if (eventName) {
      const events = pressType === 'keydown' ? this.keydownEvents : this.keyupEvents;
      const eventHandler = events[eventName];
      if (eventHandler) {
        eventHandler();
      }
    }
  }

  registerEvent(eventName: keyof typeof DefaultKeybinds, callback: () => void, eventType: KeyEvent = 'keydown') {
    const events = eventType === 'keydown' ? this.keydownEvents : this.keyupEvents;
    events[eventName] = callback;
  }

  getCurrentKeybind(eventName: keyof typeof DefaultKeybinds): number {
    const keybinds = LocalStorage.get('keybinds');
    if (!keybinds[eventName]) return DefaultKeybinds[eventName];
    return Number(keybinds[eventName]);
  }

  public async changeKeybind(eventName: keyof typeof DefaultKeybinds): Promise<number> {
    this.isBlocked = true;
    alt.toggleGameControls(false);
    alt.setMeta('keyRemap', true);
    return new Promise((resolve, reject) => {
      const keyListener = (newKey: number) => {
        alt.toggleGameControls(true);
        this.isBlocked = false;
        alt.deleteMeta('keyRemap');
        if (newKey === 27 || newKey === 1) {
          reject('Keybind cancelled!');
        } else {
          const keybinds = LocalStorage.get('keybinds');
          const existingEvent = Object.keys(keybinds).find(x => keybinds[x] === newKey);
          if (existingEvent) {
            reject('Keybind already in use!');
          } else {
            keybinds[eventName] = newKey;
            LocalStorage.set('keybinds', keybinds);
            resolve(newKey);
          }
        }
      };
      alt.once('keydown', keyListener);
    });
  }
}
export const keybindManager = new KeybindManager();
