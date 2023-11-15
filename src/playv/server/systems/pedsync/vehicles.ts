import alt from 'alt-server';
import { ConVar } from '../../../shared/conf/ConVars';
import { getRandomInt } from '../../../shared/utils/math/numbers';
import { anywhere, highway, locations, ls, paleto, ranges, sandy } from '../../../shared/data/traffic/vehicles';

export function canSpawnVehicleAtPosition(pos: alt.Vector3, player: alt.Player) {
  const isVehicleInRange = alt.getClosestEntities(pos, player.getLocalMeta('lobbySettings').traffic_density ?? 25, player.dimension, 1, 2).length === 0;
  const isPlayerInRange =
    alt.getClosestEntities(pos, player.vehicle ? ConVar.PEDSYNC.VEHICLE_SPAWN_MINDIST_TO_PLAYER + 50 : ConVar.PEDSYNC.VEHICLE_SPAWN_MINDIST_TO_PLAYER, player.dimension, 1, 1) //+50m because of vehicle speed, TODO we need some more useful calculation asap
      .length === 0;
  return isVehicleInRange && isPlayerInRange;
}

export function createRandomVehicle(pos: alt.Vector3, rot: alt.Vector3, isOnHighway: boolean) {
  const color = Math.floor(Math.random() * 242);
  const tuneVehicle = Math.random() > 0.5;
  const vehicleModel = getRandomVehicle(isOnHighway, pos);
  const vehicle = new alt.Vehicle(vehicleModel, pos.x, pos.y, pos.z + 0.05, rot.x, rot.y, rot.z, ConVar.PEDSYNC.VEHICLE_MAX_SPAWN_DISTANCE);
  if (tuneVehicle) randomTuneVehicle(vehicle);
  vehicle.engineOn = true;
  vehicle.activeRadioStation = getRandomInt(0, 18);
  vehicle.numberPlateText = getRandomNumplateText();

  switch (vehicleModel) {
    case 'ambulance':
    case 'police':
    case 'sheriff':
    case 'sheriff2':
    case 'trash2':
      // no colors for that vehicle models
      break;

    case 'taxi':
      vehicle.primaryColor = 88;
      vehicle.secondaryColor = 88;
      break;

    default:
      vehicle.primaryColor = color;
      vehicle.secondaryColor = color;
      break;
  }
  vehicle.setStreamSyncedMeta('T_justSpawned', true);
  vehicle.setMeta('stuckCount', 0);
  vehicle.setMeta('lastPos', vehicle.pos);
  return vehicle;
}

export function getRandomVehicle(isOnHighway: boolean, position: alt.Vector3) {
  let possibleLocations = anywhere;
  if (position.distanceTo(locations['ls']) < ranges['ls']) possibleLocations = ls;
  if (position.distanceTo(locations['paleto']) < ranges['paleto']) possibleLocations = paleto;
  if (position.distanceTo(locations['sandy']) < ranges['sandy']) possibleLocations = sandy;

  const possibleVehicles = isOnHighway ? highway : possibleLocations;
  const randomVehicle = possibleVehicles[getRandomInt(0, possibleVehicles.length - 1)];
  return randomVehicle;
}

export function tryTakeoverTrafficVehicle(player: alt.Player, vehicle: alt.Vehicle) {
  if (!player?.valid || !vehicle?.valid) return;
  if (player.vehicles.length > ConVar.VEHICLE.MAX_SPAWNED) return player.pushToast('error', 'You spawned too many vehicles. You are not allowed to claim this vehicle!');
  vehicle.deleteStreamSyncedMeta('T_justSpawned');
  vehicle.deleteStreamSyncedMeta('T_onHighway');
  const ped = vehicle.getStreamSyncedMeta('T_ped');
  if (ped?.valid) ped.destroy();
  vehicle.deleteStreamSyncedMeta('T_ped');

  player.emitRaw('addManageableVehicle', vehicle);
  vehicle.setStreamSyncedMeta('vehicleOwner', player.id);
  player.vehicles.push(vehicle);
  player.pushToast('success', 'This traffic vehicle has been added to your vehicles. You are now able to manage it.');
  vehicle.resetNetOwner(false);
  vehicle.setDefaultCustomProperties();
}

function randomTuneVehicle(vehicle: alt.Vehicle) {
  if (vehicle.modKitsCount === 0) return;
  vehicle.modKit = 1;
  for (let i = 0; i < 53; i++) {
    if (i === 14) continue; //no horns annoying shit
    vehicle.setMod(i, Math.floor(Math.random() * vehicle.getModsCount(i)));
  }
}

function getRandomNumplateText() {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let numberPlateText = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = getRandomInt(0, characters.length);
    numberPlateText += characters.charAt(randomIndex);
  }
  return numberPlateText;
}
