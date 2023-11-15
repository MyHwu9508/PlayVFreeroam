import alt from 'alt-client';
import _ from 'lodash';
import native from 'natives';
import { ConVar } from '../../shared/conf/ConVars';
import { utils } from '../../shared/utils';
import { getRandomInt, randomNormal } from '../../shared/utils/math/numbers';
import { currentAverageFPS } from '../utils/fps';
import { currentAveragePing } from '../utils/ping';
import { LocalStorage } from './localStorage';
import { getLobbySetting } from './lobby';
import { processFadeIn } from '../utils/entities';

let canBeNetowner = false;

export function handleTrafficPed(ped: alt.Ped) {}

export async function handleTrafficVehicle(vehicle: alt.Vehicle) {
  try {
    //  logDebug(`Traffic vehicle spawned with driver ${vehicle.getStreamSyncedMeta('T_ped')}`);

    try {
      await alt.Utils.waitFor(() => vehicle.scriptID !== 0 && vehicle.isSpawned, 3000);
    } catch {
      logDebug('err removing veh spawned too late');
      alt.emitServerRaw('t_removeVehicle', vehicle.remoteID);
    }
    let driver = vehicle.getStreamSyncedMeta('T_ped');
    if (!driver) {
      try {
        await alt.Utils.waitFor(() => vehicle.getStreamSyncedMeta('T_ped')?.scriptID, 3000);
        driver = vehicle.getStreamSyncedMeta('T_ped');
      } catch {
        logDebug('err removing ped not synced?');
        alt.emitServerRaw('t_removeVehicle', vehicle.remoteID);
      }
    }
    if (vehicle.hasStreamSyncedMeta('T_justSpawned')) {
      native.setEntityAlpha(vehicle.scriptID, 0, false);
      native.setEntityAlpha(driver.scriptID, 0, false);
    }
    try {
      await alt.Utils.waitFor(() => driver.scriptID !== 0, 3000);
    } catch {
      logDebug('err removing ped rip');
      alt.emitServerRaw('t_removeVehicle', vehicle.remoteID);
    }

    const setIntoVehicleRes = await setPedIntoVehicle(driver, vehicle);
    if (!setIntoVehicleRes || native.isEntityDead(driver.scriptID, true)) {
      logDebug('err removing setped into vehicle rip');
      alt.emitServerRaw('t_removeVehicle', vehicle.remoteID);
      return;
    }

    const activateRaio = Math.random() > 0.8 && LocalStorage.get('trafficVehiclesRadio') === true;
    native.setVehicleRadioLoud(vehicle.scriptID, activateRaio);
    native.setVehicleRadioEnabled(vehicle.scriptID, activateRaio);

    native.activatePhysics(vehicle.scriptID); //it feels like this helps with vehicles spawning too far away are not moving when they are spawned?
    native.activatePhysics(driver.scriptID);

    native.disablePedPainAudio(driver.scriptID, true);
    // native.setPedCanBeDraggedOut(driver.scriptID, false);
    // native.setPedStayInVehicleWhenJacked(driver.scriptID, true);
    // native.setPedCanBeShotInVehicle(driver.scriptID, false);
    // native.setPedCanBeKnockedOffVehicle(driver.scriptID, 1);
    native.setPedGetOutUpsideDownVehicle(driver.scriptID, false);
    native.setPedConfigFlag(driver.scriptID, 229, true);
    native.setPedConfigFlag(driver.scriptID, 276, true);
    native.setPedConfigFlag(driver.scriptID, 294, true);
    native.setPedCombatAttributes(driver.scriptID, 3, Math.random() > 0.5); // BF_CanLeaveVehicle = 3 > Wenn aktiv kann aussteigen und fetzen
    native.setPedCombatAttributes(driver.scriptID, 17, Math.random() > 0.5); //BF_AlwaysFlee = 17
    native.setPedCombatAttributes(driver.scriptID, 58, Math.random() > 0.5); // BF_DisableFleeFromCombat = 58
    native.setVehicleEngineOn(vehicle, true, true, false);
    native.taskVehicleDriveWander(driver.scriptID, vehicle, vehicle.hasStreamSyncedMeta('T_onHighway') ? 30 : 15, Math.random() > 0.5 ? 540843 : 16555); //mit ampel stop 540843, ohne 540715 //16555 ohne overtaken
    native.setPedKeepTask(driver.scriptID, true);
    native.setDriverAggressiveness(driver.scriptID, Math.random());
    native.setDriverAbility(driver.scriptID, Math.random());

    native.giveWeaponToPed(driver.scriptID, ConVar.PEDSYNC.PED_WEAPONS[getRandomInt(0, ConVar.PEDSYNC.PED_WEAPONS.length - 1)], 9999, false, true); //TODO nur einmal waffen geben war iwie buggy idk > Re-Stream = neue Waffe

    if (native.isEntityUpsidedown(vehicle.scriptID)) {
      logDebug('err removing stuck on roof');
      native.setVehicleOnGroundProperly(vehicle.scriptID, 1);
    }

    if (vehicle.hasStreamSyncedMeta('T_justSpawned')) {
      native.setVehicleForwardSpeed(vehicle, vehicle.hasStreamSyncedMeta('T_onHighway') ? 25 : 5);
      alt.emitServerRaw('confirmTrafficVehicle', vehicle.remoteID);
    }

    if (native.getEntityAlpha(vehicle.scriptID) === 0) processFadeIn(vehicle);
    if (native.getEntityAlpha(driver.scriptID) === 0) processFadeIn(driver);
  } catch (e) {
    logDebug(`ERROR SYNC ` + e);
  }
}

async function setPedIntoVehicle(ped: alt.Ped, vehicle: alt.Vehicle) {
  if (native.isPedInVehicle(ped.scriptID, vehicle.scriptID, false)) return true;
  return new Promise(resolve => {
    let tries = 0;
    const interval = alt.setInterval(() => {
      tries++;
      if (tries >= 100) {
        alt.logError('setPedIntoVehicle timeout');
        alt.clearInterval(interval);
        resolve(false);
      }
      if (vehicle && vehicle.valid) {
        native.setPedIntoVehicle(ped.scriptID, vehicle, -1);
        if (native.isPedSittingInVehicle(ped.scriptID, vehicle)) {
          alt.clearInterval(interval);
          resolve(true);
        }
      }
    }, 61);
  });
}
export function canBeNetownerTick() {
  if (currentAveragePing > 250 || currentAverageFPS < 20 || !alt.getLocalMeta('isLoggedIn')) {
    if (canBeNetowner === true) {
      alt.setMeta('canBeNetOwner', false);
      canBeNetowner = false;
      setCanBeNetowner(false);
      setCanBeNetowner.flush();
    }
  } else if (canBeNetowner === false) {
    canBeNetowner = true;
    setCanBeNetowner(true);
    alt.setMeta('canBeNetOwner', true);
  }
}

const setCanBeNetowner = _.debounce(state => {
  alt.emitServerRaw('canBeNetOwner', state);
}, 10000);

setInterval(() => {
  getVehicleNode();
}, 250);

export function getVehicleNode() {
  if (!alt.hasLocalMeta('isLoggedIn')) return;
  if (alt.getMeta('canBeNetOwner') === false) return;
  if (getLobbySetting('traffic_enabled') === false) return;
  if (alt.getLocalMeta('isInSpawnProtectArea')) return; //nono in spawnprotect
  const streamedVehicles = alt.Vehicle.streamedIn.filter(x => x.type === 1 && x.valid && x.hasStreamSyncedMeta('T_ped')); //only synced vehicles, ignore parked ones!
  const vehPos = streamedVehicles.map(x => x.pos);
  const vehicleCount = streamedVehicles.length;
  const freeSlots = Math.min(ConVar.PEDSYNC.VEHICLE_STREAM_IN_TARGET - vehicleCount, ConVar.PEDSYNC.VEHICLE_SPAWN_MINNODES_PER_TICK);
  const foundNodes: [alt.Vector3, number, boolean][] = [];
  for (let i = 0; i < freeSlots; i++) {
    // Get the player's position and rotation
    const pos = localPlayer.vehicle?.pos ?? localPlayer.pos;

    // Get the player's vehicle speed
    const playerSpeed = native.getEntitySpeed(localPlayer);

    // Calculate the angle based on the vehicle's speed
    const speedFactor = Math.min(playerSpeed / ConVar.PEDSYNC.MAX_SPEED_FOR_ANGLE, 1);
    const angle = (ConVar.PEDSYNC.MAX_ANGLE_STANDING_STILL - ConVar.PEDSYNC.MIN_ANGLE_FULL_SPEED) * (1 - speedFactor) + ConVar.PEDSYNC.MIN_ANGLE_FULL_SPEED;
    const radian = (angle / 360) * Math.PI;
    const randomAngle = Math.random() * 2 * radian;
    const res = randomAngle - radian;
    const spawnRadius = ConVar.PEDSYNC.VEHICLE_SPAWN_RADIUS + playerSpeed * 2.5; //*2.2 war okayish aber zu wenig
    const randPos = {
      x: pos.x - Math.sin(localPlayer.rot.z + res) * spawnRadius,
      y: pos.y + Math.cos(localPlayer.rot.z + res) * spawnRadius,
      z: pos.z,
    };

    const [, nodePos, heading] = native.getClosestVehicleNodeWithHeading(randPos.x, randPos.y, randPos.z, new alt.Vector3(0), 0, 0, 3, 0);
    // log2D.add(1, speedFactor.toString());
    // log2D.add(2, 'spawnR' + spawnRadius.toString());
    // log2D.add(3, 'angle' + angle.toString());
    // log2D.add(4, alt.Vehicle.streamedIn.length.toString());
    const [, density, flags] = native.getVehicleNodeProperties(nodePos.x, nodePos.y, nodePos.z);
    // const switchDirection = Math.random() > 0.5 ? 1 : -1;
    // const dirVec = new alt.Vector3(0, 0, (heading / 180) * Math.PI);
    // const finalPos = utils.vector.moveRelative(nodePos, new alt.Vector3(-4, 0, 0), dirVec);
    const oppositeTraficSpeedFactor = Math.min(playerSpeed / 150, 1);
    const oppositeTrafficChance = 0.3 * oppositeTraficSpeedFactor + 0.04;
    // log2D.add(3, oppositeTrafficChance.toFixed(3));
    const [finalPos, finalHeading] = flipNodeDirection(nodePos, heading, Math.random() > oppositeTrafficChance); //TODO flip more when vehicle is slower
    const bounds = native.getRoadBoundaryUsingHeading(finalPos.x, finalPos.y, finalPos.z, finalHeading, new alt.Vector3(0));
    const lerpedPos = finalPos.lerp(bounds[1], randomNormal());
    if (pos.distanceTo(lerpedPos) < ConVar.PEDSYNC.VEHICLE_SPAWN_MINDIST_TO_PLAYER) {
      // i--;
      continue;
    }
    const minDistance = getLobbySetting('traffic_density') / ((density + 5) / 4);
    const invalid = vehPos.some(x => x.distanceTo(nodePos) < minDistance);
    if (invalid) {
      //   i--;
      continue;
    }
    if (isNodeJunction(flags)) continue;
    foundNodes.push([lerpedPos, (finalHeading / 180) * Math.PI, isNodeHighway(flags)]);
    vehPos.push(lerpedPos);
  }
  if (!foundNodes || foundNodes.length === 0) return;
  alt.emitServerRaw('addVehSyncSpawn', foundNodes);
}

function flipNodeDirection(nodePosition: alt.Vector3, heading: number, flipDirection: boolean, moveAmount = 2) {
  const checkPos = utils.vector.moveForward(nodePosition, new alt.Vector3(0, 0, heading).toRadians(), flipDirection ? moveAmount : -moveAmount);
  const [, pos, heading2] = native.getNthClosestVehicleNodeWithHeading(checkPos.x, checkPos.y, checkPos.z, 1, new alt.Vector3(0), 0, 0, 0, 0, 0);
  return [pos, heading2] as const;
}

function isNodeHighway(flags: number) {
  // Return true if 6th bit is set
  return (flags & 0b1000000) !== 0;
}

function isNodeJunction(flags: number) {
  return (flags & 0b10000000) !== 0;
}
