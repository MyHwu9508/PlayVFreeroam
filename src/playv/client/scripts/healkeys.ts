import alt from 'alt-client';
import native from 'natives';
import { keybindManager } from '../systems/keybinds';
import { pushToast } from '../ui/hud/toasts';
import { permissions } from '../systems/access/permissions';
import { getLobbySetting } from '../systems/lobby';
import { setFloatingButtons } from '../ui/hud/floatingKeybinds';
import { KEYNAMES } from '../../shared/data/keycodes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let healTimeout: any;

keybindManager.registerEvent('keybind.healHealth', () => {
  startTryHeal();
});

keybindManager.registerEvent('keybind.healArmor', () => {
  startTryHeal(true);
});

async function startTryHeal(armor = false) {
  if (localPlayer.getStreamSyncedMeta('inPassiveMode')) {
    return pushToast('warning', 'You dont need to heal in passive mode!');
  }

  if (!permissions.can('healkeys.use')) {
    return pushToast('warning', 'You dont have the permission to use healkeys! Either because you have the menu open, or because the lobby owner removed the permission for it');
  }
  if (localPlayer.health >= 200 && !armor) {
    return pushToast('warning', 'You already have full health!');
  }
  if (localPlayer.armour >= 100 && armor) {
    return pushToast('warning', 'You already have full armor!');
  }
  if (native.isPedFalling(localPlayer.scriptID) || localPlayer.isParachuting) return pushToast('warning', 'You cant heal  while falling!');
  if (native.isPedRagdoll(localPlayer.scriptID) || localPlayer.isInRagdoll) return pushToast('warning', 'You cant heal  while ragdolling!');
  if (native.isPedGettingUp(localPlayer.scriptID)) return pushToast('warning', 'You cant heal  while getting up!');
  if (permissions.getStateActive('healing')) return pushToast('warning', 'You are already healing!');
  if (native.isPedReloading(localPlayer) || localPlayer.isReloading) return pushToast('warning', 'You cant heal  while reloading!');
  if (alt.getLocalMeta('isDead')) return;
  if (alt.Player.local.vehicle) {
    return pushToast('warning', 'You cant heal  while in a vehicle!');
  }
  if (alt.hasMeta('usedHealRecently')) return pushToast('warning', 'You cant start healing that quick, slow down!');
  if (armor) {
    alt.emitServerRaw('playAnimation', 'anim@heists@narcotics@funding@gang_idle', 'gang_chatting_idle01', 33, -1, getLobbySetting('healduration'), false, false, false, 8, 8);
  } else {
    alt.emitServerRaw('playAnimation', 'amb@medic@standing@tendtodead@idle_a', 'idle_a', 33, -1, getLobbySetting('healduration'), false, false, false, 8, 8);
  }
  setFloatingButtons([[KEYNAMES[keybindManager.getCurrentKeybind('keybind.interaction')], 'Cancel Heal']]);

  permissions.setStateActive('healing', true);
  alt.setMeta('usedHealRecently', true);
  healTimeout = setTimeout(async () => {
    setFloatingButtons([]);
    healTimeout = undefined;
    const res = await alt.emitRpc('requestHeal', armor);
    pushToast('success', 'Healing ' + (armor ? 'armor' : 'health') + ' finished!');
    permissions.setStateActive('healing', false);
    if (alt.hasMeta('usedHealRecently')) alt.deleteMeta('usedHealRecently');
  }, getLobbySetting('healduration'));

  alt.setTimeout(() => {
    if (alt.hasMeta('usedHealRecently')) alt.deleteMeta('usedHealRecently');
  }, 2000);
}

export function cancelHeal(stopAnimation = true) {
  if (healTimeout) {
    setFloatingButtons([]);
    if (stopAnimation) alt.emitServerRaw('stopAnyAnimation');
    alt.clearTimeout(healTimeout);
    healTimeout = undefined;
  }
  permissions.setStateActive('healing', false);
}
