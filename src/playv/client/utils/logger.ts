import alt from 'alt-client';
import native from 'natives';

let text2D: Record<string, string> = {};

const logColors = {
  default: '',
  logtest: '~r~[Logtest]~w~',
  access: '~lr~[Access]~w~',
  lobby: '~g~[Lobby]~w~',
  keybind: '~b~[Keybind]~w~',
  menu: '~c~[Menu]~w~',
  hud: '~y~[Hud]~w~',
  login: '~m~[Login]~w~',
} as const;

export function flog(module: keyof typeof logColors, ...content: unknown[]) {
  alt.log(logColors[module], ...content);
}

export function flogError(module: keyof typeof logColors, ...args: unknown[]) {
  alt.log(logColors[module], '~lr~[ERROR]', ...args);
}

export function flogDebug(...args: unknown[]) {
  alt.logDebug('~lc~[DEBUG]~w~', ...args);
}

export const flog2D = {
  add(id: string | number, text: string) {
    text2D[id] = text;
  },
  reset() {
    text2D = {};
  },
  draw() {
    if (!alt.debug) return;
    let i = 0;
    for (const key in text2D) {
      native.beginTextCommandDisplayText('STRING');
      native.addTextComponentSubstringPlayerName(text2D[key]);
      native.setTextOutline();
      native.setTextScale(0.5, 0.5);
      native.endTextCommandDisplayText(0.05 + Math.floor(i / 18) * 0.5, 0.05 + ((i * 0.05) % 0.9), 0);
      i++;
    }
  },
};

globalThis.log = flog;
globalThis.logError = flogError;
globalThis.logDebug = flogDebug;
globalThis.log2D = flog2D;
globalThis.localPlayer = alt.Player.local;
