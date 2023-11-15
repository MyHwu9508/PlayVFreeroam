import alt from 'alt-client';
import native from 'natives';
import { applyStanceData, setVehicleEngineAudio } from '../scripts/vehicles';
import { syncNitro } from '../scripts/nitro';
import { handleTrafficPed, handleTrafficVehicle } from '../systems/pedSync';
import { handleParkedVehicle } from '../systems/parkedVehicles';
import { setVehicleInPassiveMode } from '../scripts/passiveMode';
import { handleSpawnAreaPed } from '../scripts/spawnarea/spawnPed';

alt.on('gameEntityCreate', (entity: alt.Entity) => {
  try {
    switch (entity.type) {
      case 1: {
        //Vehicle
        const vehicle = entity as alt.Vehicle;
        if (entity.hasStreamSyncedMeta('stanceSync')) {
          applyStanceData(vehicle, vehicle.getStreamSyncedMeta('stanceSync'));
        }
        if (entity.hasStreamSyncedMeta('mutedSiren')) {
          native.setVehicleHasMutedSirens(vehicle, entity.getStreamSyncedMeta('mutedSiren') as boolean);
        }
        if (entity.hasStreamSyncedMeta('nitroOn')) {
          syncNitro(vehicle, vehicle.getStreamSyncedMeta('nitroOn'));
        }
        if (entity.hasStreamSyncedMeta('customEngineSound')) {
          setVehicleEngineAudio(vehicle, entity.getStreamSyncedMeta('customEngineSound') as string);
        }
        if (entity.getStreamSyncedMeta('inPassiveMode') === true) {
          setVehicleInPassiveMode(vehicle);
        }
        if (entity.hasStreamSyncedMeta('T_ped')) {
          try {
            handleTrafficVehicle(vehicle);
          } catch (e) {
            logDebug(`ERROR SYNC ` + e);
          }
        }
        break;
      }
      case 2: {
        //Ped
        const ped = entity as alt.Ped;
        if (entity.hasStreamSyncedMeta('T_vehicleID')) {
          handleTrafficPed(ped);
        }
        if (ped.hasStreamSyncedMeta('isSpawnAreaPed')) {
          handleSpawnAreaPed(ped);
        }
        break;
      }

      case 25: {
        //LocalVehicle
        const localVehicle = entity as unknown as alt.LocalVehicle;
        if (entity.hasMeta('isParkedVehicle')) {
          handleParkedVehicle(localVehicle);
        }
        break;
      }
      case 19: {
        //alt.LocalObject
        if (entity.hasMeta('spawnFlag')) {
          native.freezeEntityPosition(entity.scriptID, true);
        }
      }
    }
  } catch (e) {
    logDebug(`ERROR SYNC ` + e);
  }
});
