import alt from 'alt-server';
import { customLobby } from '../systems/lobby/customLobbys';

alt.onClient('requestRefillWeapons', refillWeapons);

export function giveLobbyWeapons(player: alt.Player, dimension: number) {
  player.removeAllWeapons();
  for (const weapon of customLobby.getWeapons(dimension)) {
    player.giveWeapon(weapon, 9999, false);
  }
}

function refillWeapons(player: alt.Player) {
  if (!player.canPerformAction('weapons.refill', 3000)) return;
  player.removeAllWeapons();
  for (const weapon of customLobby.getWeapons(player.dimension)) {
    player.giveWeapon(weapon, 9999, false);
  }
}

export function fillWeaponAmmo(player: alt.Player, weapon: number) {
  if (!customLobby.getWeapons(player.getLocalMeta('dimension')).includes(weapon)) return;
  player.giveWeapon(weapon, 9999, false);
}
