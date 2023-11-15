import alt from 'alt-server';
import { VehicleData } from '../../entities/vehicleData';
import { permissions } from '../../systems/access/permissions';

export function spawnVehicle(model: string, position: alt.Vector3, rotation: alt.Vector3, appearanceData?: VehicleData, player?: alt.Player) {
  const vehicle = new alt.Vehicle(model, position, rotation);

  if (vehicle.modKitsCount === 1) vehicle.modKit = 1;
  vehicle.setDefaultCustomProperties();

  if (!appearanceData) return vehicle;

  vehicle.pearlColor = appearanceData.pearlColor;
  vehicle.primaryColor = appearanceData.primaryColor;
  vehicle.secondaryColor = appearanceData.secondaryColor;
  vehicle.dashboardColor = appearanceData.dashboardColor;
  vehicle.interiorColor = appearanceData.interiorColor;
  vehicle.headlightColor = appearanceData.headlightColor;
  vehicle.wheelColor = appearanceData.wheelColor;
  vehicle.customTires = appearanceData.customTires;
  vehicle.numberPlateIndex = appearanceData.numberPlateIndex;
  vehicle.numberPlateText = appearanceData.numberPlateText;
  vehicle.neonColor = appearanceData.neonColor;
  vehicle.neon = appearanceData.neon;
  vehicle.lightsMultiplier = appearanceData.lightsMultiplier;
  vehicle.driftModeEnabled = appearanceData.driftModeEnabled;
  vehicle.windowTint = appearanceData.windowTint;
  vehicle.tireSmokeColor = appearanceData.tireSmokeColor;
  vehicle.setWheels(appearanceData.wheelType, appearanceData.frontWheels); //TODO maybe broken?
  vehicle.setRearWheels(appearanceData.rearWheels);

  if (appearanceData.usingPrimaryRGB) {
    vehicle.customPrimaryColor = new alt.RGBA(appearanceData.customPrimaryColor.r, appearanceData.customPrimaryColor.g, appearanceData.customPrimaryColor.b);
    vehicle.setMeta('usingPrimaryRGB', true);
  }

  if (appearanceData.usingSecondaryRGB) {
    vehicle.customSecondaryColor = appearanceData.customSecondaryColor;
    vehicle.setMeta('usingSecondaryRGB', true);
  }
  if (appearanceData.tuningParts) {
    if (appearanceData.tuningParts.length > 0) {
      if (player && player.valid) {
        if (permissions.can(player, 'vehicle.tuning')) {
          applyVehicleTuning(appearanceData, vehicle);
        } else {
          player.pushToast('information', 'You tried to spawn a vehicle with tuning parts, but this is not allowed in this lobby!');
        }
      } else {
        applyVehicleTuning(appearanceData, vehicle);
      }
    }
  }
  if (appearanceData.activeExtras) {
    vehicle.setMeta('activeExtras', appearanceData.activeExtras);
    appearanceData.activeExtras.forEach(extra => {
      vehicle.setExtra(extra, true);
    });
  }
  if (appearanceData.customEngineSound) {
    vehicle.setStreamSyncedMeta('customEngineSound', appearanceData.customEngineSound);
  }
  if (appearanceData.wheelStanceData) {
    vehicle.setStreamSyncedMeta('stanceSync', appearanceData.wheelStanceData);
  }

  return vehicle;
}

function applyVehicleTuning(appearanceData: VehicleData, vehicle: alt.Vehicle) {
  appearanceData.tuningParts.forEach(vehMod => {
    try {
      vehicle.setMod(vehMod[0], vehMod[1]);
    } catch (e) {
      console.log(`Error setting mod ${vehMod[0]} to ${vehMod[1]} on SAVEDvehicle ${vehicle.id}, ${vehicle.model}}`);
    }
  });
}
