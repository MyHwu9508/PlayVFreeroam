import alt from 'alt-client';
import native from 'natives';

declare module 'alt-client' {
  export interface Vehicle {
    canBeTuned(): boolean;
    isAeroVehicle(): boolean;
    isEmergencyVehicle(): boolean;
  }
}

alt.Vehicle.prototype.canBeTuned = function canBeTuned() {
  return native.getNumModKits(this) === 1 ? true : false;
};

alt.Vehicle.prototype.isAeroVehicle = function isAeroVehicle() {
  return native.getVehicleClass(this) === 15 || native.getVehicleClass(this) === 16;
};

alt.Vehicle.prototype.isEmergencyVehicle = function isEmergencyVehicle() {
  return native.getEntityBoneIndexByName(this, 'siren1') !== -1 || native.getVehicleClass(this) == 18;
};
