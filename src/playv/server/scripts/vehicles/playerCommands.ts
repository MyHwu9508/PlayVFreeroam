import alt from 'alt-server';
import { permissions } from '../../systems/access/permissions';
import log from '../../utils/logger';
import { ConVar } from '../../../shared/conf/ConVars';
import { spawnVehicle } from './factory';
import { VehicleLog } from '../../entities/vehicleLog';
import { AppDataSource } from '../../systems/db/TypeORM';
import { getVehicleFromID } from './misc';
import { WheelStanceData } from '../../../shared/types/types';
import { Vector3 } from 'alt-client';

const _allowedVehicleMethods = ['repair', 'setExtra', 'setMod', 'setWheels', 'setRearWheels'];
const _allowedVehicleAttributes = [
  'driftModeEnabled',
  'customPrimaryColor',
  'customSecondaryColor',
  'primaryColor',
  'secondaryColor',
  'numberPlateText',
  'lockState',
  'numberPlateType',
  'neon',
  'neonColor',
  'headlightColor',
  'lightsMultiplier',
  'pearlColor',
  'interiorColor',
  'dashboardColor',
  'customTires',
  'wheelColor',
  'windowTint',
  'tireSmokeColor',
];

alt.onClient('requestVehicleNitro', handleNitroRequest);
alt.onClient('requestModelSpawnVehicle', requestModelSpawnVehicle);
alt.onClient('runVehicleAction', runVehicleAction);
alt.onClient('runVehicleMethod', runVehicleMethod);
alt.onClient('setVehicleAttribute', setAttribute);
alt.onClient('bulkSetMods', bulkSetMods);
alt.onClient('deleteSpawnedVehicleByID', deleteSpawnedVehicleByID);
alt.onClient('setVehicleSirenSound', setVehicleSirenSound);
alt.onClient('syncWheelStance', syncWheelStance);
alt.onClient('setVehicleEngineSound', setVehicleEngineSound);

function setVehicleEngineSound(player: alt.Player, vehicleID: number, sound: string) {
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle?.valid || !player?.valid) return;
  vehicle.setStreamSyncedMeta('customEngineSound', sound);
}

function syncWheelStance(player: alt.Player, vehicleID: number, stanceData: WheelStanceData) {
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle?.valid || !player?.valid) return;
  vehicle.setStreamSyncedMeta('stanceSync', stanceData);
}

function setVehicleSirenSound(player: alt.Player, vehicleID: number, sound: boolean) {
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle?.valid || !player?.valid) return;
  vehicle.setStreamSyncedMeta('mutedSiren', sound);
}

function deleteSpawnedVehicleByID(player: alt.Player, vehicleID: number) {
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle?.valid || !player?.valid) return;
  vehicle.removeFromServer();
}

function setAttribute(player: alt.Player, attributeName: string, vehicleID: number, args: any) {
  if (!_allowedVehicleAttributes.includes(attributeName))
    return player.addLog('Vehicle', `${player.socialID} tried to set attribute ${attributeName.slice(0, 10)} on vehicle ${vehicleID} with args ${args.length}`, 'redBright');
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle?.valid || !player?.valid) return;
  vehicle[attributeName] = args;
  switch (attributeName) {
    case 'primaryColor':
      vehicle.setMeta('usingPrimaryRGB', false);
      break;
    case 'secondaryColor':
      vehicle.setMeta('usingSecondaryRGB', false);
      break;
    case 'customPrimaryColor':
      vehicle.setMeta('usingPrimaryRGB', true);
      break;
    case 'customSecondaryColor':
      vehicle.setMeta('usingSecondaryRGB', true);
      break;
  }
}

function runVehicleAction(player: alt.Player, vehicleID: number, action: string) {
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle) return;
  switch (action) {
    case 'Teleport to vehicle':
      player.pos = vehicle.pos;
      break;

    case 'Teleport to driver seat':
      player.pos = vehicle.pos;
      player.altSetIntoVehicle(vehicle, -1);
      break;

    case 'Repair':
      vehicle.repair();
      break;

    case 'Kick passengers out':
      for (const [seat, vplayer] of Object.entries(vehicle.passengers)) {
        vplayer.clearTasks();
      }
      break;
  }
}

function handleNitroRequest(player: alt.Player, state: boolean) {
  if (!player?.valid || !player.vehicle || player.seat !== 1) return;
  if (!permissions.can(player, 'vehicle.nitro')) return log('pink', '[PERMISSIONS] Player ' + player.userData.username + 'tried to use nitro without permission', true);
  player.vehicle.setStreamSyncedMeta('nitroOn', state);
}

export function requestModelSpawnVehicle(player: alt.Player, model: string, spawnLocation?: [Vector3, Vector3], customPrimaryColor?, customSecondaryColor?) {
  if (!player.canPerformAction('vehiclespawnModel', 2000)) return;
  if (!permissions.can(player, 'vehicle.spawn')) {
    player.pushToast('error', 'You do not have permission to spawn vehicles!');
    return;
  }
  if (player.vehicles.length >= ConVar.VEHICLE.MAX_SPAWNED) {
    player.pushToast('warning', 'You have too many vehicles spawned! Delete some to spawn more.');
    return;
  }
  const vehicle = spawnVehicle(model, spawnLocation[0], spawnLocation[1]);
  if (!vehicle) {
    player.pushToast('warning', 'Something went wrong. If this keeps happening, please contact the support!');
    alt.log('error spawning vehicle? ' + model);
    return;
  }
  AppDataSource.manager.insert(VehicleLog, {
    userID: player.userData.userID,
    vehicleModel: model,
  });
  vehicle.numberPlateText = 'playv';
  vehicle.customPrimaryColor = customPrimaryColor ?? new alt.RGBA(0, 0, 0);
  vehicle.customSecondaryColor = customSecondaryColor ?? new alt.RGBA(0, 0, 0);
  vehicle.setMeta('usingPrimaryRGB', true);
  vehicle.setMeta('usingSecondaryRGB', true);
  vehicle.dimension = player.getLocalMeta('dimension') as number;
  vehicle.setStreamSyncedMeta('vehicleOwner', player.id);
  player.vehicles.push(vehicle);
  player.altSetIntoVehicle(vehicle, -1);
  player.emitRaw('addManageableVehicle', vehicle);
  return;
}

function runVehicleMethod(player: alt.Player, methodName: string, vehicleID: number, ...args: any[]) {
  if (!_allowedVehicleMethods.includes(methodName))
    return player.addLog('Vehicle', `${player.socialID} tried to run method ${methodName.slice(0, 10)} on vehicle ${vehicleID} with args ${args.length}`, 'redBright');
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle?.valid || !player?.valid) return;

  switch (methodName) {
    case 'setExtra':
      {
        const extraID = args[0] as number;
        const state = args[1] as boolean;
        let currentExtras = vehicle.getMeta('activeExtras') as number[];
        if (state) {
          if (!currentExtras.includes(extraID)) {
            currentExtras.push(extraID);
          }
        } else {
          if (currentExtras.includes(extraID)) {
            currentExtras = currentExtras.filter(x => x !== extraID);
          }
        }
        vehicle.setMeta('activeExtras', currentExtras);
      }
      break;

    case 'setMod':
      if (vehicle.getModsCount(args[0]) < args[1]) return player.pushToast('warning', 'This vehicle does not support this mod!');
      break;
  }

  vehicle[methodName](...args);
}

function bulkSetMods(player: alt.Player, vehicleID: number, mods: Array<[number, number]>) {
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle?.valid || !player?.valid) return;
  if (!mods || mods.length === 0) return;
  mods.forEach(mod => {
    try {
      vehicle.setMod(mod[0], mod[1]);
    } catch (e) {
      alt.logDebug(`Error setting mod ${mod[0]} to ${mod[1]} on vehicle ${vehicle.id}, ${vehicle.model}}`);
    }
  });
}
