import alt from 'alt-client';
import native from 'natives';
import { ConVar } from '../../shared/conf/ConVars';
import { getLobbySetting } from '../systems/lobby';
import { LocalStorage } from '../systems/localStorage';

alt.setInterval(() => {
  runInterval();
}, 5 * 1000);

function runInterval() {
  // if (LocalStorage.getKey('randomThunder')) {
  //   native.forceLightningFlash();
  // }
  if (!getLobbySetting('traffic_enabled')) return;
  for (const vehicle of alt.Vehicle.streamedIn) {
    if (!vehicle.getStreamSyncedMeta('T_ped')) continue;
    if (vehicle.netOwner !== localPlayer) continue;
    if (!vehicle?.valid) continue;
    //Delete vehicle when it reaches a max position > when standing still they get out of brain really fast > When moving fast server is deleting the vehicles for us
    if (vehicle.pos.distanceTo(localPlayer.pos) > ConVar.PEDSYNC.VEHICLE_MAX_DISTANCE + native.getEntitySpeed(localPlayer.vehicle ?? localPlayer)) {
      logDebug(`Removing vehicle ${vehicle.remoteID} because it is too far away from the player`);
      alt.emitServerRaw('t_removeVehicle', vehicle.remoteID);
    }
  }
}
