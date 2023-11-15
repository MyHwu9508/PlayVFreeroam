import alt from 'alt-client';
import native from 'natives';

export function setVehicleInPassiveMode(vehicle: alt.Vehicle) {
  if (localPlayer.vehicle === vehicle) return;
  native.setEntityGhostedForGhostPlayers(vehicle, true);
}
export function setPlayerInPassiveMode(state: boolean) {
  native.setLocalPlayerAsGhost(state, state);
}
