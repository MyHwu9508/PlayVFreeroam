import * as alt from 'alt-client';
import * as native from 'natives';
import { keybindManager } from '../systems/keybinds';
import { permissions } from '../systems/access/permissions';

const player = alt.Player.local;

function toggleNitro(state: boolean, vehicle?: alt.Vehicle) {
  alt.setMeta('isNitroRunning', state);
  if (state) {
    native.shakeGameplayCam('VIBRATE_SHAKE', 1);
    if (vehicle) native.setVehicleBoostActive(vehicle, true);
    native.animpostfxPlay('RaceTurbo', 0, false);
    native.setTimecycleModifier('rply_motionblur');
  } else {
    native.stopGameplayCamShaking(true);
    if (vehicle) native.setVehicleBoostActive(vehicle, false);
    native.animpostfxStop('RaceTurbo');
    native.clearTimecycleModifier();
  }
}

keybindManager.registerEvent(
  'keybind.vehicleNitro',
  () => {
    if (!player.vehicle) return;
    if (player.seat !== 1) return;
    if (!alt.getMeta('isNitroRunning') && permissions.can('vehicle.nitro')) {
      alt.emitServerRaw('requestVehicleNitro', true);
    }
  },
  'keydown'
);

keybindManager.registerEvent(
  'keybind.vehicleNitro',
  () => {
    if (!player.vehicle) return;
    if (alt.getMeta('isNitroRunning')) {
      alt.emitServerRaw('requestVehicleNitro', false);
    }
  },
  'keyup'
);

export function syncNitro(vehicle: alt.Vehicle, state: boolean) {
  logDebug('syncNitro', vehicle.id, state);
  if (state) {
    native.requestNamedPtfxAsset('veh_xs_vehicle_mods');
    native.setOverrideNitrousLevel(vehicle, true, 0.0, 0.0, 0, true);
  } else {
    native.setOverrideNitrousLevel(vehicle, false, 0.0, 0.0, 0, true);
  }
  if (vehicle === player.vehicle) {
    toggleNitro(state, vehicle);
  }
}

export function nitroTick() {
  if (!player.vehicle) return;
  if (!alt.getMeta('isNitroRunning')) return;
  if (!player.vehicle.hasStreamSyncedMeta('nitroOn')) {
    toggleNitro(false);
  }
  if (localPlayer.seat !== 1) return;
  native.setVehicleCheatPowerIncrease(player.vehicle, 5);
}
