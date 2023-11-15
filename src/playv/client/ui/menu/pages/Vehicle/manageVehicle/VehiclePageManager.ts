import alt from 'alt-client';
import native from 'natives';
import { VehicleData } from '../../../../../../server/entities/vehicleData';
import { initializeCustomVehicleFromServer, setGodmode, setVehicleDisplayName } from '../../../../../scripts/vehicles';
import { menu, menuState } from '../../../framework/State';
import { createVehiclePage } from './Main';
import { page as VehiclePage } from '../../Vehicle';
import { createHandlingPage } from './Handling';
import { createNeonAndLightsPage } from './NeonAndLights';
import { createPaintjobPage } from './Paintjob';
import { createRimsAndTiresPage } from './RimsAndTires';
import { createTuningPage } from './Tuning';
import { createEngineSoundPage } from './EngineSound';
import { createSavePage } from './Save';
import { createExtrasPage } from './Extras';
import { permissions } from '../../../../../systems/access/permissions';

const pageLinks = new Map<number, string>();
export function registerVehicleManager() {
  alt.onServer('addManageableVehicle', addManageableVehicle);
  alt.onServer('removeManageableVehicle', removeManageableVehicle);
}

async function addManageableVehicle(vehicle: alt.Vehicle, appearanceData?: VehicleData) {
  logDebug(`Adding vehicle ${vehicle?.remoteID} to vehicle manager.`, JSON.stringify(appearanceData));
  await alt.Utils.waitFor(() => vehicle.isSpawned && vehicle.scriptID !== undefined, 10000).catch(e => {
    logError('menu', 'VEHICLE IS NOT VALID! :( ', vehicle?.remoteID, e);
    return;
  });

  await setVehicleDisplayName(vehicle, appearanceData);

  if (permissions.can('vehicle.godmode')) {
    setGodmode(vehicle, true);
  }
  vehicle.setMeta('neverDirty', true); //by default keep all vehicles clean
  if (appearanceData) {
    initializeCustomVehicleFromServer(vehicle, appearanceData);
  }

  const pageLink = VehiclePage.addLink(vehicle.getMeta('displayName'), `/vehicle/manage/${vehicle.remoteID}`);
  pageLinks.set(vehicle.remoteID, pageLink.id);
  pageLink.context = getSpawnedVehicleContext(vehicle);

  menu.addPage(`/vehicle/manage/${vehicle.remoteID}`, createVehiclePage(vehicle));
  menu.addPage(`/vehicle/manage/${vehicle.remoteID}/handling`, createHandlingPage(vehicle));
  menu.addPage(`/vehicle/manage/${vehicle.remoteID}/neonandlights`, createNeonAndLightsPage(vehicle));
  menu.addPage(`/vehicle/manage/${vehicle.remoteID}/paintjob`, createPaintjobPage(vehicle));
  if (vehicle.wheelsCount > 0) {
    menu.addPage(`/vehicle/manage/${vehicle.remoteID}/rimsandtires`, createRimsAndTiresPage(vehicle));
  }
  menu.addPage(`/vehicle/manage/${vehicle.remoteID}/tuning`, createTuningPage(vehicle));
  menu.addPage(`/vehicle/manage/${vehicle.remoteID}/enginesound`, createEngineSoundPage(vehicle));
  menu.addPage(`/vehicle/manage/${vehicle.remoteID}/save`, createSavePage(vehicle));
  menu.addPage(`/vehicle/manage/${vehicle.remoteID}/extras`, createExtrasPage(vehicle));

  menuState.setPath(`/vehicle/manage/${vehicle.remoteID}`);
}

function removeManageableVehicle(vehicleID: number) {
  const pageLinkID = pageLinks.get(vehicleID);
  if (!pageLinkID) return;
  VehiclePage.removeComponentById(pageLinkID);
  pageLinks.delete(vehicleID);

  menu.removePage(`/vehicle/manage/${vehicleID}`);
  menu.removePage(`/vehicle/manage/${vehicleID}/handling`);
  menu.removePage(`/vehicle/manage/${vehicleID}/neonandlights`);
  menu.removePage(`/vehicle/manage/${vehicleID}/paintjob`);
  menu.removePage(`/vehicle/manage/${vehicleID}/rimsandtires`);
  menu.removePage(`/vehicle/manage/${vehicleID}/tuning`);
  menu.removePage(`/vehicle/manage/${vehicleID}/enginesound`);
  menu.removePage(`/vehicle/manage/${vehicleID}/save`);
  menu.removePage(`/vehicle/manage/${vehicleID}/extras`);
}

function getSpawnedVehicleContext(vehicle: alt.Vehicle) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">Name</span> ${vehicle.getMeta('displayName')}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Spawned at</span> ${new Date().toLocaleTimeString()}<br>`;
  context += '</div>';
  return context;
}
