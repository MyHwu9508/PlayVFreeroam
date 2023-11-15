import alt from 'alt-client';
import { LobbySettings, defaultLobbySettings } from '../../shared/types/lobby';
import native from 'natives';
import { LocalStorage } from './localStorage';
import { trySetMovementClipset } from '../scripts/player/movementClipset';
import { updateWeather } from '../scripts/world/weather';
import { ConVar } from '../../shared/conf/ConVars';
import TimeControler from '../scripts/world/time';

alt.onServer('applyLobbyFlags', applyLobbyFlags);

export function getLobbySetting<K extends keyof LobbySettings>(key: K): LobbySettings[K] {
  if (!alt.hasLocalMeta('lobbySettings')) return defaultLobbySettings[key];
  return alt.getLocalMeta('lobbySettings')[key] ?? defaultLobbySettings[key];
}

export async function applyLobbyFlags() {
  await alt.Utils.waitFor(() => alt.getLocalMeta('isLoggedIn') === true, 9999999);
  native.setPedCanRagdoll(localPlayer, true);
  native.setRunSprintMultiplierForPlayer(localPlayer, getLobbySetting('runningSpeed'));
  native.setPedConfigFlag(localPlayer, 35, LocalStorage.get('putOnMotobikeHelmet'));
  native.setPedConfigFlag(localPlayer, 409, true); //Keep scuba gear on when not in water = 409,
  native.setPedConfigFlag(localPlayer, 32, getLobbySetting('canFlyThruWindscreen'));
  native.setPedConfigFlag(localPlayer, 122, !getLobbySetting('melee')); // DisableMeleeCombat = 281,
  trySetMovementClipset(LocalStorage.get('movementClipset'));
  native.setPedConfigFlag(localPlayer, 26, alt.getLocalMeta('isInSpawnProtectArea')); //PCF_DontAllowToBeDraggedOutOfVehicle = 26 Prevents a ped from being able to be dragged out of a car
  native.setEnableVehicleSlipstreaming(getLobbySetting('vehicleSlipStreaming'));
  native.setPedConfigFlag(localPlayer, 438, true); //  DisableHelmetArmor = 438,
  TimeControler.refreshTime();
  updateWeather();
}
