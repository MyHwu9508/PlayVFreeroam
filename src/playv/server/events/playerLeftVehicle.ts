import alt from 'alt-server';
import { playerLeftPassiveModeVehicle } from '../scripts/passiveMode';

alt.on('playerLeftVehicle', (player: alt.Player, vehicle: alt.Vehicle, seat: number) => {
  if (vehicle.hasStreamSyncedMeta('inPassiveMode')) playerLeftPassiveModeVehicle(player, vehicle, seat);
  if (seat === 1 && vehicle.hasStreamSyncedMeta('nitroOn')) {
    vehicle.deleteStreamSyncedMeta('nitroOn');
  }
  if (player.getLocalMeta('isInSpawnProtectArea') && vehicle.getStreamSyncedMeta('vehicleOwner') === player.id) {
    vehicle.removeFromServer();
    player.pushToast('warning', 'Leaving your vehicle in spawn area will delete it! We use that to prevent clogging in spawn area. Thank you for understanding!');
  }
});
