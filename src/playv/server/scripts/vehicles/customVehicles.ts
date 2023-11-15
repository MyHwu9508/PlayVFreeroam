/* eslint-disable prefer-const */
/* eslint-disable import/no-mutable-exports */
import alt from 'alt-server';
import { VehicleData } from '../../entities/vehicleData';
import chalk from 'chalk';
import _ from 'lodash';
import { VehicleLog } from '../../entities/vehicleLog';
import { onPromiseClient } from '../../utils/promiseEvents';
import { ConVar } from '../../../shared/conf/ConVars';
import { doesStringContainBadWord } from '../../utils/badWords';
import { AppDataSource } from '../../systems/db/TypeORM';
import { spawnVehicle } from './factory';
import { VehicleHandling } from '../../../shared/types/vehicleHandling';
import { getVehicleFromID } from './misc';
import { CommunityVehicle } from '../../../shared/types/types';
import { permissions } from '../../systems/access/permissions';

alt.onClient('saveCustomVehicle', saveCustomVehicleFromPlayer);
alt.onClient('requestSpawnCustomVehicle', spawnCustomVehicle);
alt.onClient('deleteCustomVehicle', deleteCustomVehicle);

export let cachedFormattedPublicVehicles: CommunityVehicle[] = [];
export let allCustomVehicles: VehicleData[] = [];
getAllCustomVehicles(); //init all from DB when startup eyeyeyeyeyyehehehehe

async function saveCustomVehicleFromPlayer(player: alt.Player, vehicleID: number, saveName: string, isPublic: boolean, handling?: VehicleHandling) {
  const vehicle = getVehicleFromID(player, vehicleID);
  if (!vehicle) return;
  if (!player.canPerformAction('vehicleSaveCustom', 30000)) return;
  if (saveName.length > ConVar.ALL.MAX_SAVENAME_LENGTH) return player.pushToast('error', 'The name you provided is too long!');
  const isNameBadWord = doesStringContainBadWord(saveName);
  if (isNameBadWord) return player.pushToast('error', 'The name contains forbidden words!');
  if (vehicle.getStreamSyncedMeta('vehicleOwner') !== player.id) {
    player.addLog('Vehicle', 'Tried to save vehicle that he does not own!', 'yellow');
    return;
  }

  //Check if player actually saves handling or bullshit > injection maybe
  if (handling && JSON.stringify(handling).length > 5000) {
    player.addLog('Vehicle', 'Tried to save a vehicle with too long handling?!', 'bgRedBright');
    return player.pushToast('error', 'Error');
  }
  if (handling && handling['petrolTankVolume'] === undefined) {
    player.addLog('Vehicle', 'Tried to save a vehicle with missing handling propertys?!', 'bgRedBright');
    return player.pushToast('error', 'Error');
  }

  //Check if too many saved
  if (isPublic) {
    const publicVehCount = allCustomVehicles.filter(v => v.owner.userID === player.userData.userID && v.isPublic === true).length;
    if (publicVehCount >= ConVar.VEHICLE.MAX_PUBLIC) {
      player.pushToast('error', 'You have reached the maximum amount of public vehicles you can save!');
      return;
    }
  } else {
    const ownVehCount = allCustomVehicles.filter(v => v.owner.userID === player.userData.userID && v.isPublic === false).length;
    if (ownVehCount >= ConVar.VEHICLE.MAX_PRIVATE) {
      player.pushToast('error', 'You have reached the maximum amount of private vehicles you can save!');
      return;
    }
  }

  const appearanceData: VehicleData = {
    owner: player.userData,
    modelHash: vehicle.model,
    modelName: vehicle.getSpawnName(),
    pearlColor: vehicle.pearlColor,
    primaryColor: vehicle.primaryColor,
    secondaryColor: vehicle.secondaryColor,
    usingPrimaryRGB: vehicle.getMeta('usingPrimaryRGB'),
    usingSecondaryRGB: vehicle.getMeta('usingSecondaryRGB'),
    customPrimaryColor: vehicle.customPrimaryColor,
    customSecondaryColor: vehicle.customSecondaryColor,
    customTires: vehicle.customTires,
    dashboardColor: vehicle.dashboardColor,
    numberPlateIndex: vehicle.numberPlateIndex,
    numberPlateText: vehicle.numberPlateText,
    frontWheels: vehicle.frontWheels,
    rearWheels: vehicle.rearWheels,
    wheelType: vehicle.wheelType,
    headlightColor: vehicle.headlightColor,
    interiorColor: vehicle.interiorColor,
    neonColor: vehicle.neonColor,
    neon: vehicle.neon,
    lightsMultiplier: vehicle.lightsMultiplier,
    tireSmokeColor: vehicle.tireSmokeColor,
    wheelColor: vehicle.wheelColor,
    driftModeEnabled: vehicle.driftModeEnabled,
    windowTint: vehicle.windowTint,
    tuningParts: vehicle.getTuningParts(),
    activeExtras: vehicle.getMeta('activeExtras') ?? [],
    customEngineSound: vehicle.getStreamSyncedMeta('customEngineSound') ?? null,
    wheelStanceData: vehicle.getStreamSyncedMeta('stanceSync') ?? null,
    handlingData: handling ?? null,
    saveName: saveName,
    isPublic: isPublic,
  };
  const dbistbehindert = _.clone(appearanceData); //clone because db is killing the nested objects :(
  const res = await AppDataSource.manager.insert(VehicleData, appearanceData);
  if (res) {
    player.pushToast('success', 'Vehicle saved successfully!');
  }
  dbistbehindert.id = res.identifiers[0].id;
  alt.logDebug('Saved vehicle with id: ' + res.identifiers[0].id);
  allCustomVehicles.push(dbistbehindert); // save to cache
  //data to add to cache (public vehicles)
  if (isPublic) {
    const publicFormattedDataToAdd: CommunityVehicle = [res.identifiers[0].id, saveName, vehicle.getSpawnName(), player.userData.username];
    cachedFormattedPublicVehicles.push(publicFormattedDataToAdd);
    alt.emitAllClientsUnreliable('addCommunityVehicle', publicFormattedDataToAdd);
  }
  //data for owner to add to client
  const ownFormattedDataToAdd = [res.identifiers[0].id, saveName, vehicle.getSpawnName(), isPublic];
  player.emitRaw('addSavedVehicle', ownFormattedDataToAdd);
}

// [data.id, data.saveName, data.modelName, data.owner.username];
async function getAllCustomVehicles() {
  allCustomVehicles = await AppDataSource.manager.find(VehicleData, {
    relations: { owner: true },
  });

  const publicVehCount = allCustomVehicles.filter(v => v.isPublic).length;
  for (let i = 0; i < allCustomVehicles.length; i++) {
    const vehicle = allCustomVehicles[i];
    if (vehicle.isPublic) cachedFormattedPublicVehicles.push([vehicle.id, vehicle.saveName, vehicle.modelName, vehicle.owner.username]);
  }
  alt.log(chalk.bold.overline.underline.magentaBright(`${publicVehCount} public & ${allCustomVehicles.length - publicVehCount} private custom vehicles cached`));
}

onPromiseClient('getSavedVehicles', player => {
  const res = allCustomVehicles.filter(x => x.owner.userID === player.userData.userID);
  const ownData: [number, string, string, boolean][] = res.map(ownVehicle => {
    return [ownVehicle.id, ownVehicle.saveName, ownVehicle.modelName, ownVehicle.isPublic];
  });
  return ownData;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
onPromiseClient('getCommunityVehicles', (player: alt.Player) => {
  return cachedFormattedPublicVehicles;
});

async function spawnCustomVehicle(player: alt.Player, customVehicleID: number, location: [alt.Vector3, alt.Vector3]) {
  if (!player?.valid || customVehicleID === undefined) return;
  if (!player.canPerformAction('vehicleSpawnCustom', 2000)) return;
  if (!permissions.can(player, 'vehicle.spawn')) {
    player.pushToast('error', 'You do not have permission to spawn vehicles!');
    return;
  }
  alt.logDebug('spawning ' + customVehicleID);
  const vehicleAppearanceData = allCustomVehicles.find(x => x.id === customVehicleID);
  if (!vehicleAppearanceData) {
    player.pushToast('error', 'Vehicle model not found!');
    player.addLog('Vehicle', '? error spawning vehicle ' + customVehicleID, 'yellow');
    return;
  }
  //check if vehicle is public or owned by player
  if (!vehicleAppearanceData.isPublic && vehicleAppearanceData.owner.userID !== player.userData.userID) {
    player.pushToast('error', 'The vehicle you tried to spawn is not public and not owned by you!');
    player.addLog('Vehicle', '? error spawning vehicle ' + customVehicleID, 'yellow');
    return;
  }
  if (player.vehicles.length >= ConVar.VEHICLE.MAX_SPAWNED) {
    player.pushToast('error', 'You spawned too many vehicles! Deleted unused ones first!');
    return;
  }
  const vehicle = spawnVehicle(vehicleAppearanceData.modelName, location[0], location[1], vehicleAppearanceData, player);
  if (!vehicle) return alt.log('error spawning custrom vehicle ' + customVehicleID);

  AppDataSource.manager.insert(VehicleLog, {
    userID: player.userData.userID,
    customVehicleID: customVehicleID,
  });
  vehicle.dimension = player.getLocalMeta('dimension') as number;
  vehicle.setStreamSyncedMeta('vehicleOwner', player.id);
  player.vehicles.push(vehicle);
  player.altSetIntoVehicle(vehicle, -1);
  //if handling is not allowed do not send it to player when spawning a vehicle
  if (vehicleAppearanceData.handlingData) {
    if (permissions.can(player, 'vehicle.handling')) {
      player.emitRaw('addManageableVehicle', vehicle, _.omit(vehicleAppearanceData, 'owner'));
    } else {
      player.pushToast('information', 'You have tried to spawn a vehicle with custom handling. This is not allowed in this lobby and therefore the handling has not been applied!');
      player.emitRaw('addManageableVehicle', vehicle, _.omit(vehicleAppearanceData, 'owner', 'handlingData'));
    }
  } else {
    player.emitRaw('addManageableVehicle', vehicle, _.omit(vehicleAppearanceData, 'owner'));
  }
}

async function deleteCustomVehicle(player: alt.Player, customVehicleID: number) {
  if (!player.canPerformAction('vehicleDeleteCustom', 5000)) return;
  alt.logDebug('del custom vehicle ' + customVehicleID);
  if (isNaN(customVehicleID)) {
    player.addLog('Vehicle', 'tried to delete vehicle without numebr? ' + customVehicleID, 'yellow');
    return;
  }
  const foundVehicle = allCustomVehicles.find(x => x.id === customVehicleID);
  const canDeleteVehicle = foundVehicle.owner.userID === player.userData.userID;
  if (!canDeleteVehicle) {
    player.addLog('Vehicle', 'tried to delete vehicle without permission? ' + customVehicleID, 'yellow');
    return;
  }
  //deletion from DB
  await AppDataSource.manager.delete(VehicleData, {
    id: customVehicleID,
  });
  if (!foundVehicle) {
    player.addLog('Vehicle', 'error while deleting vehicle? :( ' + customVehicleID, 'yellow');
    return;
  }
  const cachedVehIndex = cachedFormattedPublicVehicles.findIndex(x => x[0] === customVehicleID);
  if (cachedVehIndex !== -1) cachedFormattedPublicVehicles.splice(cachedVehIndex, 1);
  allCustomVehicles.splice(allCustomVehicles.indexOf(foundVehicle), 1);
  player.emitRaw('savedVehicleDeleted', customVehicleID);
  player.pushToast('success', 'Your vehicle has been deleted!');
}
