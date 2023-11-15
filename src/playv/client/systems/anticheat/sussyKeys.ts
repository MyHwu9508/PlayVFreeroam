/* eslint-disable import/no-mutable-exports */
import { permissions } from '../access/permissions';
import alt from 'alt-client';

let pressedSusKeys: { [key: string]: number };

export function getSussyKeys() {
  return pressedSusKeys;
}

export function resetSussyKeys() {
  pressedSusKeys = {};
}

alt.on('keyup', key => {
  if (permissions.getStateActive('uiActive')) return;
  if (!alt.isGameFocused()) return;
  // if (localPlayer.currentWeapon == 0xa2719263) return; //not fist
  let keyCode = '';
  switch (key) {
    case 0x2e:
      keyCode = 'ENTF';
      break;

    case 0x2d:
      keyCode = 'EINFG';
      break;

    case 0x23:
      keyCode = 'ENDE';
      break;

    // case 0x26:
    //   keyCode = 'PFEIL HOCH';
    //   break;

    // case 0x27:
    //   keyCode = 'PFEIL RECHTS';
    //   break;
    // case 0x28:
    //   keyCode = 'PFEIL RUNTER';
    //   break;
    case 0x24:
      keyCode = 'HOME';
      break;
    default:
      return;
  }
  if (!pressedSusKeys) pressedSusKeys = {};
  if (!pressedSusKeys[keyCode]) pressedSusKeys[keyCode] = 1;
  pressedSusKeys[keyCode]++;
});
