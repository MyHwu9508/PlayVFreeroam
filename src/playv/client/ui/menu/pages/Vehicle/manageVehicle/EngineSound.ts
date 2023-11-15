import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';
import vehicles from '../../../../../../shared/data/vehicles';

export function createEngineSoundPage(vehicle: alt.Vehicle) {
  const page = new Page('Engine Sound');
  const engineSounds = Object.values(vehicles)
    .map(x => x.Name)
    .sort((a, b) => a.localeCompare(b));
  for (const sound of engineSounds) {
    page.addButton(sound).onInput(comp => {
      //native.setVehicleEngineAudio(vehicle.scriptID, sound);
      alt.emitServerRaw('setVehicleEngineSound', vehicle.remoteID, sound);
    });
  }
  return page;
}
