import alt from 'alt-server';
import { ConVar } from '../../shared/conf/ConVars';

alt.onClient('requestSetPassiveMode', requestSetPassiveMode);

function requestSetPassiveMode(player: alt.Player, state: boolean) {
  if (!player.canPerformAction('changeGhostMode', 10000)) return;
  setPlayerPassiveMode(player, state);
}

export function setPlayerPassiveMode(player: alt.Player, state: boolean, force = false) {
  if (!player || !player.valid) return;
  if (player.getMeta('changePassiveModeInProgress') && !force) return player.addLog('Other', 'Passive Mode already changing???', 'redBright');
  player.invincible = state;
  player.setMeta('changePassiveModeInProgress', true);
  player.setStreamSyncedMeta('inPassiveMode', state);
  let playerOldVehicle: alt.Vehicle;
  const playerCurrentDimension = player.dimension;
  if (!state) {
    if (player.vehicle && player.seat === 1) {
      playerOldVehicle = player.vehicle;
    }
    player.dimension = ConVar.GHOSTMODE.TEMP_DIM;
    setTimeout(() => {
      if (!player || !player.valid) return;
      player.dimension = playerCurrentDimension;
      player.deleteMeta('changePassiveModeInProgress');
      if (playerOldVehicle && playerOldVehicle.valid) {
        player.altSetIntoVehicle(playerOldVehicle, -1);
      }
    }, player.ping + ConVar.GHOSTMODE.RESPAWN_TIMEOUT);
  } else {
    player.deleteMeta('changePassiveModeInProgress');
  }
  if (player.vehicle && player.vehicle.driver === player) {
    player.vehicle.setStreamSyncedMeta('inPassiveMode', state);
  }
}

export function playerLeftPassiveModeVehicle(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
  if (!player || !player.valid) return;
  if (player.getMeta('changePassiveModeInProgress')) return player.addLog('Other', 'Passive Mode already changing???', 'redBright');
  player.setMeta('changePassiveModeInProgress', true);
  const playerCurrentDimension = player.dimension;
  if (vehicle.hasStreamSyncedMeta('inPassiveMode')) {
    if (seat === 1) {
      vehicle.deleteStreamSyncedMeta('inPassiveMode');
      vehicle.streamed = false;
      setTimeout(() => {
        if(!vehicle || !vehicle.valid) return;
        vehicle.streamed = true;
      }, player.ping + ConVar.GHOSTMODE.RESPAWN_TIMEOUT);
    }
    player.dimension = ConVar.GHOSTMODE.TEMP_DIM;
    setTimeout(() => {
      if (!player || !player.valid) return;
      player.dimension = playerCurrentDimension;
      player.deleteMeta('changePassiveModeInProgress');
    }, player.ping + ConVar.GHOSTMODE.RESPAWN_TIMEOUT);
  }
}

export function playerEnteredPassiveModeVehicle(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
  if (player.getStreamSyncedMeta('inPassiveMode') && seat === 1) vehicle.setStreamSyncedMeta('inPassiveMode', true);
}
