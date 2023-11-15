import alt from 'alt-server';
import type { VehicleHandling } from '../../shared/types/vehicleHandling';
import vehicles from '../../shared/data/vehicles';
import { cachedFormattedModdedVehicles } from '../scripts/vehicles/moddedVehicles';
import { destroyTrafficVehicle } from '../systems/pedsync/manager';

declare module 'alt-server' {
  export interface Vehicle {
    removeFromServer(): void;
    getSpawnName(): string;
    getTuningParts(): number[][];
    setDefaultCustomProperties(): void;

    // customEngineSound: string;
    // wheelStanceData: [number[], number[], number[]]; // frag mich nicht was dieser typ ist, ok?
    // handlingData: VehicleHandling; //only used for saving?
    // acceleratorModifier: number; //only used for saving?
    // modifiedTopSpeed: number; //only used for saving?
  }
}

alt.Vehicle.prototype.removeFromServer = function () {
  if (!this.valid) return;
  if (this.hasStreamSyncedMeta('T_ped')) {
    destroyTrafficVehicle(this);
    return;
  }
  const owner = this.getStreamSyncedMeta('vehicleOwner') as number;
  if (owner !== undefined) {
    const player = alt.Player.getByID(owner);
    if (player?.valid) {
      player.emitRaw('removeManageableVehicle', this.id);
      player.vehicles = player.vehicles.filter(x => x !== this);
    }
  }
  this.destroy();
};

alt.Vehicle.prototype.getSpawnName = function () {
  if (!this.valid) return '';
  const vehData = vehicles[this.model];
  if (!vehData) {
    const moddedVehData = cachedFormattedModdedVehicles.find(x => alt.hash(x[1]) === this.model);
    return moddedVehData[1];
  } else {
    return vehData.Name.toLowerCase();
  }
};

alt.Vehicle.prototype.getTuningParts = function () {
  let _mods: number[][] = [];
  for (let j = 0; j < 49; j++) {
    let modIndex = this.getMod(j);
    if (modIndex > 0) {
      _mods.push([j, modIndex]);
    }
  }
  return _mods;
};

alt.Vehicle.prototype.setDefaultCustomProperties = function () {
  this.setMeta('activeExtras', []);
  this.setMeta('usingPrimaryRGB', false);
  this.setMeta('usingSecondaryRGB', false);
};
