import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';
import { setGodmode } from '../../../../../scripts/vehicles';
import { permissions } from '../../../../../systems/access/permissions';
import { Toggle } from '../../../framework/components/Toggle';
import { teleport } from '../../../../../scripts/player/teleport';

let vehgodmodecomp: Toggle;

export function createVehiclePage(vehicle: alt.Vehicle) {
  const page = new Page(vehicle.getMeta('displayName'));

  page.addOverlay('Quick Actions', ['Teleport to driver seat', 'Teleport to vehicle', 'Repair', 'Flip', 'Kick passengers out']).onInput(comp => {
    switch (comp.value) {
      case 'Teleport to vehicle':
      case 'Teleport to driver seat':
        teleport(vehicle.pos);
        break;

      case 'Kick passengers out':
        alt.emitServer('runVehicleAction', vehicle.remoteID, comp.value);
        break;

      case 'Repair':
        alt.emitServerRaw('runVehicleMethod', 'repair', vehicle.remoteID);
        break;

      case 'Flip':
        native.setVehicleOnGroundProperly(vehicle, 1);
        break;
    }
  });
  page.addLink('Paintjob', `/vehicle/manage/${vehicle.remoteID}/paintjob`);
  page.addLink('Tuning', `/vehicle/manage/${vehicle.remoteID}/tuning`).addPermission('vehicle.tuning');
  if (vehicle.wheelsCount > 0) {
    page.addLink('Rims and Tires', `/vehicle/manage/${vehicle.remoteID}/rimsandtires`);
  }
  page.addLink('Neon and Lights', `/vehicle/manage/${vehicle.remoteID}/neonandlights`);

  page.addLink('Save', `/vehicle/manage/${vehicle.remoteID}/save`);
  page.addConfirm('Delete', 'Are you sure you want to delete this vehicle?', 'error').onInput(comp => {
    alt.emitServerRaw('deleteSpawnedVehicleByID', vehicle.remoteID);
  });
  vehgodmodecomp = page.addToggle('Godmode', vehicle.getMeta('godmode') ?? false, 'checkbox').onInput(comp => {
    setGodmode(vehicle, comp.value);
  });
  page.addToggle('Never Dirty', vehicle.getMeta('neverDirty') ?? false, 'checkbox').onInput(comp => {
    vehicle.setMeta('neverDirty', comp.value);
  });
  if (vehicle.isEmergencyVehicle()) {
    page.addToggle('Mute Siren Sound').onInput(comp => {
      alt.emitServerRaw('setVehicleSirenSound', vehicle.remoteID, comp.value);
    });
  }
  page.addToggle('Drift Mode', vehicle.getMeta('driftModeEnabled')).onInput(comp => {
    alt.emitServerRaw('setVehicleAttribute', 'driftModeEnabled', vehicle.remoteID, comp.value);
    vehicle.setMeta('driftModeEnabled', comp.value);
  });
  page.addToggle('Lock Doors', vehicle.lockState === 2, 'checkbox').onInput(comp => {
    alt.emitServerRaw('setVehicleAttribute', 'lockState', vehicle.remoteID, comp.value ? 2 : 0);
  });

  page.addToggle('Engine Running', true).onInput(comp => {
    native.setVehicleEngineOn(vehicle, comp.value, true, true);
  });

  page.addInput('Numberplate Text', native.getVehicleNumberPlateText(vehicle) ?? '', 8).onFinished((comp, confirm) => {
    if (!confirm) return;
    alt.emitServerRaw('setVehicleAttribute', 'numberPlateText', vehicle.remoteID, comp.value);
  });
  page
    .addLink('Engine Sound', `/vehicle/manage/${vehicle.remoteID}/enginesound`)
    .addContext('Do you ever wanted your asbo to sound like a jugular? Well, here you can change the engine sound of your vehicle.');
  page
    .addLink('Handling', `/vehicle/manage/${vehicle.remoteID}/handling`)
    .addContext('You can change the handling of your vehicle here. For example you can change the top speed of your vehicle. If greyed out, ask the lobby owner for permission!')
    .addPermission('vehicle.handling');
  page
    .addLink('Extras', `/vehicle/manage/${vehicle.remoteID}/extras`)
    .addContext('Not all vehicle have vehicle extras. For example you can change the roof styling of the faction with this.');

  page
    .addOverlay('Doors')
    .onInput(comp => {
      const door = comp.currentIndex;
      if (native.getVehicleDoorAngleRatio(vehicle, Number(door)) > 0) {
        native.setVehicleDoorShut(vehicle, Number(door), false);
      } else {
        native.setVehicleDoorOpen(vehicle, Number(door), false, false);
      }
    })
    .onBeforeActive(async comp => {
      comp.inputs = [
        ['Front Left', native.getVehicleDoorAngleRatio(vehicle, 0) > 0],
        ['Front Right', native.getVehicleDoorAngleRatio(vehicle, 1) > 0],
        ['Rear Left', native.getVehicleDoorAngleRatio(vehicle, 2) > 0],
        ['Rear Right', native.getVehicleDoorAngleRatio(vehicle, 3) > 0],
        ['Hood', native.getVehicleDoorAngleRatio(vehicle, 4) > 0],
        ['Trunk', native.getVehicleDoorAngleRatio(vehicle, 5) > 0],
        ['Unknown', native.getVehicleDoorAngleRatio(vehicle, 6) > 0],
      ];
    });

  page.onBeforeOpen(() => {
    vehgodmodecomp.disabled = !permissions.can('vehicle.godmode');
  });

  return page;
}
