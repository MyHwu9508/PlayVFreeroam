import alt from 'alt-server';
import { ConVar } from '../../../shared/conf/ConVars';
import { canSpawnVehicleAtPosition, createRandomVehicle } from './vehicles';
import { getRandomPed } from './peds';
import { spawnLocations } from '../../../shared/conf/SpawnConfig';
import { spawnAreaPeds } from '../../../shared/data/traffic/peds';
import { createPedBlip } from '../../scripts/blips';

const spawnedVehicles = new Map<alt.Vehicle, alt.Ped>();
const vehicleBlips = new Map<alt.Vehicle, alt.PointBlip>();
alt.setInterval(onTick, ConVar.PEDSYNC.TICK_INTERVAL);
alt.onClient('t_removeVehicle', destroyTrafficVehicleByID);
alt.onClient('canBeNetOwner', (player: alt.Player, canBeNetOwner: boolean) => {
  alt.logDebug('canBeNetOwner: ' + canBeNetOwner);
  player.setMeta('blockNetOwner', !canBeNetOwner);

  // player.netOwnershipDisabled = !canBeNetOwner;
});
export let recentlyUsedTrafficSpawnPositions: alt.Vector3[] = [];

alt.onClient('addVehSyncSpawn', (player: alt.Player, nodes: [alt.Vector3, number, boolean][]) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return;
  const savedNodes = player.getMeta('vehSyncNodes');
  if (Array.isArray(nodes)) savedNodes.push(...nodes);
  savedNodes.splice(10, savedNodes.length - 10);
  player.setMeta('vehSyncNodes', savedNodes);
});

alt.onClient('confirmTrafficVehicle', (player: alt.Player, vehicleID: number) => {
  const vehicle = alt.Vehicle.getByID(vehicleID);
  if (!vehicle) return;
  vehicle.setMeta('T_recentNetownerChange', Date.now());
  vehicle.deleteStreamSyncedMeta('T_justSpawned');
});

function onTick() {
  const allTrafficPlayers = alt.Player.all.filter(
    player =>
      player?.valid &&
      player.userData &&
      (player.getMeta('blockNetOwner') ?? true) === false &&
      player.getLocalMeta('lobbySettings')?.traffic_enabled === true &&
      !player.getLocalMeta('isInSpawnProtectArea')
  );

  for (const player of allTrafficPlayers) {
    trySpawnWanderingVehicle(player);
  }
  recentlyUsedTrafficSpawnPositions = [];

  const vehicleLoop = spawnedVehicles.entries();
  for (const [vehicle, ped] of vehicleLoop) {
    if (!vehicle?.valid) {
      continue;
    }

    if (alt.debug) {
      const blip = vehicleBlips.get(vehicle);
      if (blip) blip.pos = vehicle.pos;
    }
    //do not force migration of new unconfirmed vehicles!
    if (vehicle.hasStreamSyncedMeta('T_justSpawned')) continue;

    if (vehicle.pos.distanceTo(vehicle.getMeta('lastPos')) < 3) {
      vehicle.setMeta('stuckCount', vehicle.getMeta('stuckCount') + 1);
    } else {
      vehicle.setMeta('stuckCount', 0);
      vehicle.setMeta('lastPos', vehicle.pos);
    }

    if (vehicle.getMeta('stuckCount') > 10 * 60) {
      //1 minute stuck > delete
      destroyTrafficVehicle(vehicle);
      continue;
    }

    //destroy in spawn area
    if (vehicle.pos.distanceTo(spawnLocations.default.protectAreaPosition) < 100) {
      destroyTrafficVehicle(vehicle);
      continue;
    }

    if (
      Date.now() - vehicle.getMeta('T_recentNetownerChange') < ConVar.PEDSYNC.NETOWNER_BLOCKING_TIME &&
      vehicle?.netOwner?.pos.distanceTo2D(vehicle?.pos) < ConVar.PEDSYNC.VEHICLE_MAX_SPAWN_DISTANCE
    ) {
      continue; //continue if netowner changed recently and is still close
    }

    const possibleNetowners = alt.getClosestEntities(vehicle.pos, ConVar.PEDSYNC.VEHICLE_MAX_SPAWN_DISTANCE, vehicle.dimension, 3, 1) as alt.Player[];
    if (possibleNetowners.length > 1) {
      possibleNetowners.sort((a, b) => a.pos.distanceTo2D(vehicle.pos) - b.pos.distanceTo2D(vehicle.pos));
    }

    const newNetOwners = possibleNetowners.filter(newNetOwner => newNetOwner?.valid && newNetOwner.userData && (newNetOwner.getMeta('blockNetOwner') ?? true) === false);
    // .filter(newNetOwner => newNetOwner?.valid && (!newNetOwner.vehicle || newNetOwner.seat === 1)); TEst off

    if (newNetOwners.length === 0) {
      destroyTrafficVehicle(vehicle);
      continue;
    }

    for (const newNetOwner of newNetOwners) {
      if (vehicle.netOwner?.id === newNetOwner.id) {
        break;
      }
      if (newNetOwner?.valid && vehicle?.valid && ped?.valid) {
        vehicle.setNetOwner(newNetOwner, true);
        ped.setNetOwner(newNetOwner, true);
        vehicle.setMeta('T_recentNetownerChange', Date.now());
        break;
      }
      destroyTrafficVehicle(vehicle);
    }
  }
}

function trySpawnWanderingVehicle(player: alt.Player) {
  const vehSyncNodes = player.getMeta('vehSyncNodes');
  player.setMeta('vehSyncNodes', []);
  if (vehSyncNodes.length === 0) return;
  for (const [pos, heading, isOnHighway] of vehSyncNodes) {
    if (recentlyUsedTrafficSpawnPositions.some(usedPos => usedPos.distanceTo2D(pos) <= player.getLocalMeta('lobbySettings').traffic_density)) {
      continue;
    }
    if (pos.distanceTo(spawnLocations.default.protectAreaPosition) < ConVar.SPAWN.PROTECT_RADIUS) continue;
    const rot = new alt.Vector3(0, 0, heading);
    if (!canSpawnVehicleAtPosition(pos, player)) return;
    const vehicle = createRandomVehicle(pos, rot, isOnHighway);
    const ped = getRandomPed(pos, rot);
    if (!vehicle) return;
    if (!ped) return;
    if (isOnHighway) vehicle.setStreamSyncedMeta('T_onHighway', true);
    vehicle.dimension = player.dimension;
    ped.dimension = player.dimension;
    vehicle.setStreamSyncedMeta('T_ped', ped);
    ped.setStreamSyncedMeta('T_vehicle', vehicle);
    spawnedVehicles.set(vehicle, ped);

    if (alt.debug) {
      const blip = new alt.PointBlip(pos.x, pos.y, pos.z, true);
      vehicleBlips.set(vehicle, blip);
    }
    vehicle.setNetOwner(player, true);
    ped.setNetOwner(player, true);

    recentlyUsedTrafficSpawnPositions.push(pos);

    //TODO test > maybe peds neben vehicle weil niemals confirmed? idk > Player soll eigenes vehicles confirmen mit timeout, anstatt mit meta irgendwas zu machen!
    alt.setTimeout(() => {
      if (!vehicle || !vehicle.valid) return;
      if (vehicle.hasStreamSyncedMeta('T_justSpawned')) {
        destroyTrafficVehicle(vehicle);
      }
    }, 10000);
  }
}

export function destroyTrafficVehicleByID(player: alt.Player, vehicleID: number) {
  if (!player || !player.valid) return;
  const vehicle = alt.Vehicle.getByID(vehicleID);
  if (!vehicle || !vehicle.valid) return;
  if (player !== vehicle.netOwner) return alt.logDebug('player !== vehicle.netOwner NO DELETE!!!');
  destroyTrafficVehicle(vehicle);
}

export function destroyTrafficVehicle(vehicle: alt.Vehicle) {
  const ped = vehicle.getStreamSyncedMeta('T_ped');
  if (!ped) return;
  ped?.destroy();
  vehicle?.destroy();
  spawnedVehicles.delete(vehicle);
  const blip = vehicleBlips.get(vehicle);
  if (blip) blip.destroy();
  vehicleBlips.delete(vehicle);
}

createSpawnAreaPeds();
function createSpawnAreaPeds() {
  spawnAreaPeds.forEach(pedHash => {
    const ped = new alt.Ped(pedHash, spawnLocations.default.spawnAreaPedsPosition.add(Math.random(), Math.random(), 0.5), new alt.Vector3(0), ConVar.SPAWN.PROTECT_RADIUS);
    ped.setStreamSyncedMeta('isSpawnAreaPed', true);
    createPedBlip(ped);
  });
}
