/* eslint-disable import/exports-last */
import alt from 'alt-client';
import native from 'natives';
import type { VehicleData } from '../../server/entities/vehicleData';
import vehicles, { vehicleData } from '../../shared/data/vehicles';
import { emitPromiseServer } from '../utils/promiseEvents';
import { CommunityVehicle, ModdedVehicle, SavedVehicle, WheelStanceData } from '../../shared/types/types';
import { refreshSavedVehiclePage } from '../ui/menu/pages/Vehicle/Spawner';

alt.onServer('savedVehicleDeleted', savedVehicleDeleted);
alt.onServer('setIntoVehicle', setIntoVehicle);
alt.onServer('addSavedVehicle', addSavedVehicle);
alt.onServer('addCommunityVehicle', addCommunityVehicle);

let moddedVehiclesData: ModdedVehicle[] = [];
let savedVehicleData: SavedVehicle[] = [];
let communityVehicleData: CommunityVehicle[] = [];

function addCommunityVehicle(vehicle: CommunityVehicle) {
  if (communityVehicleData.length === 0) return;
  communityVehicleData.push(vehicle);
}

function addSavedVehicle(vehicleData: SavedVehicle) {
  if (savedVehicleData) return;
  savedVehicleData.push(vehicleData);
  refreshSavedVehiclePage();
}

function savedVehicleDeleted(vehicleID: number) {
  if (savedVehicleData === undefined) return;
  const index = savedVehicleData.findIndex(v => v[0] === vehicleID);
  if (index === -1) return;
  savedVehicleData.splice(index, 1);
  refreshSavedVehiclePage();
}

export async function getCommunityVehicles() {
  if (communityVehicleData.length > 0) return communityVehicleData;
  const vehicleData = await emitPromiseServer('getCommunityVehicles');
  communityVehicleData = vehicleData;
  return vehicleData;
}

export async function getSavedVehicleData() {
  // if (savedVehicleData.length > 0) return savedVehicleData;
  const vehicleData = await emitPromiseServer('getSavedVehicles');
  // savedVehicleData = vehicleData;
  return vehicleData;
}

export async function getModdedVehicles() {
  if (moddedVehiclesData.length > 0) return moddedVehiclesData;
  const vehicleData = await emitPromiseServer('getModdedVehicles');
  moddedVehiclesData = vehicleData;
  return vehicleData;
}

function setIntoVehicle(vehicle: alt.Vehicle, seat: number = -1) {
  const interval = alt.setInterval(() => {
    if (vehicle && vehicle.valid) {
      if (native.areAnyVehicleSeatsFree(vehicle) === false) return; //if vehicle has no seat at all
      native.setPedIntoVehicle(localPlayer, vehicle, seat);
      if (native.isPedSittingInVehicle(localPlayer, vehicle)) {
        alt.clearInterval(interval);
        //clear radio when player gets inserted, because radio is annoying as heck
        native.setVehRadioStation(vehicle, 'OFF');
      }
    }
  }, 61);
}

export function applyStanceData(vehicle: alt.Vehicle, stanceData: WheelStanceData) {
  for (let i = 0; i < stanceData[0].length; i++) {
    vehicle.setWheelCamber(i, stanceData[0][i]);
  }

  for (let i = 0; i < stanceData[1].length; i++) {
    vehicle.setWheelHeight(i, stanceData[1][i]);
  }

  for (let i = 0; i < stanceData[2].length; i++) {
    vehicle.setWheelTrackWidth(i, stanceData[2][i]);
  }
}

export function setVehicleEngineAudio(vehicle: alt.Vehicle, audio: string) {
  native.forceUseAudioGameObject(vehicle, audio);
  // When changing engine sound, the radio is turning on???
  if (localPlayer.vehicle && localPlayer.vehicle === vehicle) {
    alt.setTimeout(() => {
      native.setRadioToStationName('OFF');
    }, 100);
    alt.setTimeout(() => {
      native.setRadioToStationName('OFF');
    }, 1000);
  }
}

export async function setVehicleDisplayName(vehicle: alt.Vehicle, appearanceData: VehicleData) {
  const dumpData = vehicles[vehicle.model] as vehicleData;
  if (dumpData && !appearanceData) {
    vehicle.setMeta('displayName', dumpData.DisplayName.English);
  } else if (appearanceData) {
    vehicle.setMeta('displayName', appearanceData.saveName);
  }
  if (!vehicle.hasMeta('displayName')) {
    vehicle.setMeta('displayName', '' + native.getDisplayNameFromVehicleModel(vehicle.model));
  }
}

export function initializeCustomVehicleFromServer(vehicle: alt.Vehicle, appearanceData?: VehicleData) {
  if (!appearanceData) return alt.log('tried so set custom stuff, but nothing found?');

  for (const [tuningID, tuningValue] of appearanceData.tuningParts) {
    switch (tuningID) {
      case 18:
        vehicle.setMeta('turboActivated', tuningValue === 1 ? true : false);
        break;
    }
  }

  vehicle.setMeta('wheelInscription', appearanceData.customTires);
  vehicle.setMeta('rimCategory', appearanceData.wheelType);
  vehicle.setMeta('rimIndex', appearanceData.frontWheels);
  vehicle.setMeta('rimColor', appearanceData.wheelColor);
  vehicle.setMeta('primaryBaseColor', appearanceData.primaryColor);
  vehicle.setMeta('secondaryBaseColor', appearanceData.secondaryColor);
  vehicle.setMeta('pearlColor', appearanceData.pearlColor);
  vehicle.setMeta('lightsMultiplier', appearanceData.lightsMultiplier);
  vehicle.setMeta('headlightColor', appearanceData.headlightColor);
  vehicle.setMeta('driftModeEnabled', appearanceData.driftModeEnabled);

  if (appearanceData.handlingData) {
    logDebug('default', 'setting handling data');
    for (let [key, value] of Object.entries(appearanceData.handlingData)) {
      if (key === 'handlingNameHash') continue;
      vehicle.handling[key] = value;
    }
  }
}

//TODO refactor with properties
export function setGodmode(vehicle: alt.Vehicle, state: boolean) {
  vehicle.setMeta('godmode', state);
  const intervalClearDecalsKey = 'godModeInterval';
  if (state) {
    alt.emitServerRaw('runVehicleMethod', 'repair', vehicle.remoteID);
    if (vehicle[intervalClearDecalsKey] !== undefined) {
      alt.clearInterval(vehicle[intervalClearDecalsKey]);
      vehicle[intervalClearDecalsKey] = undefined;
    }
    vehicle[intervalClearDecalsKey] = alt.setInterval(() => {
      if (vehicle && vehicle.valid) {
        native.removeDecalsFromVehicle(vehicle);
      } else if (vehicle[intervalClearDecalsKey] !== undefined) {
        alt.clearInterval(vehicle[intervalClearDecalsKey]);
        vehicle[intervalClearDecalsKey] = undefined;
      }
    }, 100);
  } else {
    if (vehicle[intervalClearDecalsKey] !== undefined) {
      alt.clearInterval(vehicle[intervalClearDecalsKey]);
      vehicle[intervalClearDecalsKey] = undefined;
    }
  }
  if (vehicle.valid) {
    // vehicle assumes we are the net owner. If someone else is netowner, then eeeeeeeeeeeeeeeeee
    native.setEntityInvincible(vehicle, state);
    native.setVehicleCanBeVisiblyDamaged(vehicle, !state);
    native.setEntityCanBeDamaged(vehicle, !state);
    native.setDontProcessVehicleGlass(vehicle, state);
  }
}

export function getClosestVehicle() {
  let data = { vehicle: null, distance: 0 };
  alt.Vehicle.streamedIn.forEach(vehicle => {
    const dis = vehicle.pos.distanceTo(localPlayer.pos);

    if (dis < data.distance || data.distance == 0) {
      data = { vehicle: vehicle, distance: dis };
    }
  });

  return data;
}
