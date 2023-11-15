import alt from 'alt-server';
import { ConVar } from '../../shared/conf/ConVars';
import { destroyTrafficVehicle } from '../systems/pedsync/manager';

alt.on('vehicleDestroy', vehicleDestroy);

function vehicleDestroy(vehicle: alt.Vehicle) {
  if (vehicle.hasStreamSyncedMeta('T_ped')) {
    setTimeout(() => {
      if (!vehicle?.valid) return;
      destroyTrafficVehicle(vehicle);
    }, ConVar.PEDSYNC.DELETE_INVALID_BROKEN);
    return;
  }

  const owner = vehicle.getStreamSyncedMeta('vehicleOwner');
  if (owner !== undefined) {
    const player = alt.Player.getByID(owner);
    if (player && player.valid) {
      player.pushToast('warning', 'Your vehicle has been destroyed and will be deleted in 1 minute! Repair it using the menu and repair button!');
      alt.setTimeout(() => {
        if (!vehicle?.valid || !vehicle.destroyed) return;
        vehicle.removeFromServer();
      }, 1 * 60 * 1000);
      return;
    }
  }
  vehicle.removeFromServer(); //kill any vehicle that just explodes or goes submarine
}
