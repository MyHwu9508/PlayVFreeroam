import alt from 'alt-client';
import native from 'natives';
import { keybindManager } from '../systems/keybinds';
import { playerDied } from '../scripts/player/respawn';

//alt.setMsPerGameMinute(2000);

alt.everyTick(() => {});

if (alt.debug) {
  keybindManager.registerEvent('keybind.test', () => {
    logDebug('testkey pressed');
  });
}
