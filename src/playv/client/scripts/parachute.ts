import alt from 'alt-client';
import native from 'natives';
import { keybindManager } from '../systems/keybinds';
import { LocalStorage } from '../systems/localStorage';
import { permissions } from '../systems/access/permissions';

keybindManager.registerEvent('keybind.forceParachute', () => {
  if (!native.isPedFalling(localPlayer)) return;
  if (!permissions.can('parachute.use')) return;
  if (localPlayer.vehicle) return;

  native.giveWeaponToPed(localPlayer, 4222310262, 1, false, true); //parachute
  native.taskParachute(localPlayer, true, true);

  native.setPedParachuteTintIndex(localPlayer, LocalStorage.get('parachuteTintColor'));

  alt.nextTick(() => {
    native.forcePedToOpenParachute(localPlayer);
  });
});
