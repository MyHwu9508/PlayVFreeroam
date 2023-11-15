import alt from 'alt-server';
import { permissions } from '../systems/access/permissions';
import { playAnimation } from './animations';
import { customLobby } from '../systems/lobby/customLobbys';

alt.onRpc('requestHeal', requestHeal);

async function requestHeal(player: alt.Player, armour: boolean) {
  if (!permissions.can(player, 'healkeys.use')) {
    return player.pushToast('warning', 'You dont have the permission to use healkeys! Ask the lobby owner to change permissions!');
  }
  if (player.getLocalMeta('isDead')) return; //not allowed when dead
  if (armour) {
    player.armour = 100;
  } else {
    player.health = 200;
  }
  return true;
}
