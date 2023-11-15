import alt from 'alt-server';

export function getVehicleFromID(player: alt.Player, id: number) {
  const vehicle = alt.Vehicle.all.find(v => v.id === id);
  if (!vehicle || !vehicle.valid) {
    player.pushToast('error', 'Vehicle not found');
    return undefined;
  }
  if (vehicle.getStreamSyncedMeta('vehicleOwner') !== player.id) {
    player.addLog('Vehicle', `Player tried to access vehicle ${vehicle.id} but does not own it!`);
    return undefined;
  }
  return vehicle;
}

export function removeAllPlayerVehicles(player: alt.Player) {
  if (!player || !player.valid || !player.vehicles) return;
  const allPlayerVehicles = player.vehicles;
  for (let i = 0; i < allPlayerVehicles.length; i++) {
    const vehicle = allPlayerVehicles[i];
    vehicle.removeFromServer();
  }
}
