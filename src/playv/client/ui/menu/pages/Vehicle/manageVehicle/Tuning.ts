import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';
import tuningParts from '../../../../../../shared/data/tuningParts';
import { NumberSelect } from '../../../framework/components/NumberSelect';
import { Toggle } from '../../../framework/components/Toggle';

const tuningComponents = new Map<number, NumberSelect>();
let turbotoggle: Toggle;

export function createTuningPage(vehicle: alt.Vehicle) {
  const page = new Page('Tuning');

  if (vehicle.canBeTuned()) {
    page.addButton('Apply Max Tuning').onInput(() => {
      applyVehicleMaxTuning(page, vehicle);
    });

    turbotoggle = page.addToggle('Turbo', vehicle.getMeta('turboActivated') ?? false, 'checkbox').onInput(comp => {
      requestSetVehicleMod(vehicle, 18, Number(comp.value));
    });
  }

  // iterate all tuning parts and add menu component to change stuff
  for (let [key, value] of Object.entries(tuningParts)) {
    const tuningKey = Number(key);
    const maxValue = getMaxNumOfTuningIndex(vehicle, tuningKey);
    const currentValue = getTuningIndex(vehicle, tuningKey);
    if (maxValue === 0) continue; // if no tuning part is available skip adding to menu
    if (tuningKey === 18) continue; //turbo used above

    const i = page
      .addNumberSelect(value, 0, maxValue, 1, Math.round(currentValue))
      .onInput(comp => {
        requestSetVehicleMod(vehicle, tuningKey, Number(comp.value));
      })
      .addThrottle(100);
    tuningComponents.set(tuningKey, i);
  }
  return page;
}

async function applyVehicleMaxTuning(page: Page, vehicle: alt.Vehicle) {
  const modsToApply = []; // array with mod changes sent to the server when buitl
  for (const key of Object.keys(tuningParts)) {
    if (Number(key) === 14) continue;
    switch (Number(key)) {
      case 18:
        vehicle.setMeta('turboActivated', true);
        modsToApply.push([18, 1]); // hardcode turbo tuning
        break;
      case 53:
        modsToApply.push([53, 0]); // hardcode numplatetype
        break;
      case 55:
        alt.emitServer('setVehicleAttribute', 'windowTint', vehicle.remoteID, 1);
        break;
      default:
        {
          const maxIndexNum = native.getNumVehicleMods(vehicle, Number(key));
          modsToApply.push([key, maxIndexNum]);
        }
        break;
    }
  }
  alt.emitServer('bulkSetMods', vehicle.remoteID, modsToApply);
  await alt.Utils.waitFor(() => native.getVehicleMod(vehicle, 55) == 4, 10000); //await window tint to be applied, then reload menu to get current values easy fix lol
  if (turbotoggle) turbotoggle.value = true;
  for (const [key, value] of tuningComponents) {
    value.value = getTuningIndex(vehicle, key);
  }
}

function requestSetVehicleMod(vehicle: alt.Vehicle, type: number, value: number) {
  logDebug('setting mod' + type + ' to ' + value + ' on vehicle ' + vehicle.id + ' ' + vehicle.model, 'tuning');
  switch (type) {
    case 18:
      vehicle.setMeta('turboActivated', Boolean(value));
      alt.emitServer('runVehicleMethod', 'setMod', vehicle.remoteID, 18, value);
      break;
    case 55:
      logDebug('setting window tint to ' + value, 'tuning');
      alt.emitServer('setVehicleAttribute', 'windowTint', vehicle.remoteID, value);
      break;
    case 53:
      alt.emitServer('setVehicleAttribute', 'numberPlateIndex', vehicle.remoteID, value);
      break;
    case 24:
      alt.emitServer('runVehicleMethod', 'setRearWheels', vehicle.remoteID, value);
      break;
    case 14:
      native.startVehicleHorn(vehicle, 3000, alt.hash('HELDDOWN'), false);
    // eslint-disable-next-line no-fallthrough
    default:
      alt.emitServer('runVehicleMethod', 'setMod', vehicle.remoteID, type, value);
      break;
  }
}

function getTuningIndex(vehicle: alt.Vehicle, tuningType: number): number {
  switch (tuningType) {
    case 55: //tint
      return native.getVehicleWindowTint(vehicle);
    case 18: //turbo
      return Number(vehicle.getMeta('turboActivated') ?? 0);
    case 53: //numplateindex
      return native.getVehicleNumberPlateTextIndex(vehicle) as number;
    default:
      return native.getVehicleMod(vehicle, tuningType) + 1;
  }
}

function getMaxNumOfTuningIndex(vehicle: alt.Vehicle, tuningType: number) {
  switch (tuningType) {
    case 18: //turbo
      return vehicle.canBeTuned() ? 1 : 0;
    case 53: //numplateindex
      return 5;
    case 55: //window tint
      return vehicle.canBeTuned() ? 3 : 0;
    default:
      return vehicle.canBeTuned() ? native.getNumVehicleMods(vehicle, tuningType) : 0;
  }
}
