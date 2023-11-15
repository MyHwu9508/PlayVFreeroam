import alt from 'alt-server';
import { ConVar } from '../../../shared/conf/ConVars';
import { trafficPeds } from '../../../shared/data/traffic/peds';
import { getRandomInt } from '../../../shared/utils/math/numbers';

export function getRandomPed(pos: alt.Vector3, rot: alt.Vector3) {
  const randomPed = trafficPeds[getRandomInt(0, trafficPeds.length - 1)];
  const ped = new alt.Ped(randomPed, pos, rot.add(0, 0, -10), ConVar.PEDSYNC.VEHICLE_MAX_SPAWN_DISTANCE);
  return ped;
}
