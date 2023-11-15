/* eslint-disable no-var */
import { browser } from '$app/environment';
import { registerMenuSync } from '$lib/script/menuSync';
import { registerMenuModals } from '$lib/script/modals';
import { registerSound } from '$lib/script/soundFX';
import { registerThemeChanger } from '$lib/script/themeChanger';
import { registerWheelMenu } from '$lib/script/wheelmenu';
import { registerToastStore } from '$lib/store/toast';

export const prerender = true;
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  const alt: {
    on: (event: string, callback: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
    once: (event: string, callback: (...args: any[]) => void) => void;
    browser: true | undefined;
  };
  var debug: boolean;
}
if (!('alt' in globalThis)) {
  //@ts-expect-error alt is not defined
  globalThis.alt = {
    on: () => {},
    emit: () => {},
    off: () => {},
    once: () => {},
    browser: true,
  };
  globalThis.debug = true;
} else {
  globalThis.debug = false;
}
if (browser) {
  registerMenuSync();
  registerToastStore();
  registerSound();
  registerMenuModals();
  registerThemeChanger();
  registerWheelMenu();
}
