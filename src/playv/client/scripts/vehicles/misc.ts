import alt from 'alt-client';
import native from 'natives';

alt.onServer('setIntoVehicle', (vehicle: alt.Vehicle, seat) => {
  setIntoVehicle(vehicle, seat);
});

function setIntoVehicle(vehicle: alt.Vehicle, seat: number = -1) {
  const interval = alt.setInterval(() => {
    if (vehicle && vehicle.valid) {
      if (native.areAnyVehicleSeatsFree(vehicle) === false) return; //if vehicle has no seat at all
      native.setPedIntoVehicle(localPlayer, vehicle, seat);
      if (native.isPedSittingInVehicle(localPlayer, vehicle)) {
        alt.clearInterval(interval);
        //clear radio when player gets inserted, because radio is annoying as heck
        native.setVehRadioStation(vehicle, 'OFF');
      }
    }
  }, 61);
}
