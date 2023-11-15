import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';

export function createExtrasPage(vehicle: alt.Vehicle) {
  const page = new Page('Extras');
  for (let i = 0; i < 20; i++) {
    if (!native.doesExtraExist(vehicle, i)) continue;

    page.addToggle('Extra' + ' ' + i, native.isVehicleExtraTurnedOn(vehicle, i)).onInput(comp => {
      alt.emitServerRaw('runVehicleMethod', 'setExtra', vehicle.remoteID, i, comp.value);
    });
  }
  return page;
}
