import alt from 'alt-server';
import { playerEnteredPassiveModeVehicle } from '../scripts/passiveMode';
import { tryTakeoverTrafficVehicle } from '../systems/pedsync/vehicles';

alt.on('playerEnteredVehicle', (player: alt.Player, vehicle: alt.Vehicle, seat: number) => {
  if (player.getLocalMeta('inPassiveMode') && seat === 1) playerEnteredPassiveModeVehicle(player, vehicle, seat);
  if (vehicle.getStreamSyncedMeta('T_ped') && seat === 1) {
    tryTakeoverTrafficVehicle(player, vehicle);
  }
});
