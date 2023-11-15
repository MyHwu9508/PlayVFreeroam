import alt from 'alt-server';
import { customLobby } from '../systems/lobby/customLobbys';

alt.onClient('informServer', informServer);
alt.onClient('log1n', log1n);

function informServer(player: alt.Player, type: string, reason: string) {
  player.addLog('Anticheat', 'ANTICHEAT-INFORM: ' + type + ' ' + reason, 'cyanBright');
}

function log1n(player: alt.Player, message: string) {
  player.addLog('Anticheat', 'Selfkick: ' + message, 'redBright');
  if (!alt.debug) player.customKick('Selfkick: ' + message);
}

export function checkPlayerWeaponAllowed(player: alt.Player, weapon: number) {
  if (weapon == 0xa2719263) return; //not fist
  if (customLobby.getWeapons(player.dimension).includes(weapon)) return;
  player.customKick('Weapon not allowed in this lobby ' + weapon);
}

// alt.onClient((eventName: string, player: alt.Player) => {
//   alt.logDebug('Player ' + player.name + ': ' + eventName);
// });
