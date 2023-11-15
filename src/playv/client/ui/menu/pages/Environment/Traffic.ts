import alt from 'alt-client';
import native from 'natives';
import { LocalStorage } from '../../../../systems/localStorage';
import { Page } from '../../framework/Page';
import { generateAllParkedVehicles, removeAllParkedVehicles, toggleAllParkedVehicles } from '../../../../systems/parkedVehicles';

const page = new Page('Traffic');

page
  .addToggle('Parked Vehicles', LocalStorage.get('parkedVehicles'))
  .onInput(comp => {
    LocalStorage.set('parkedVehicles', comp.value);
    toggleAllParkedVehicles(comp.value);
  })
  .addContext('Parked vehicles have no logic or collision and are just there to fill the city with some content. Also the vehicles are not synced with others.');

page
  .addToggle('Traffic Vehicles Radio', LocalStorage.get('trafficVehiclesRadio'))
  .onInput(comp => {
    LocalStorage.set('trafficVehiclesRadio', comp.value);
    const vehs = alt.Vehicle.streamedIn;
    for (const v of vehs) {
      native.setVehicleRadioLoud(v.scriptID, comp.value);
      native.setVehicleRadioEnabled(v.scriptID, comp.value);
    }
  })
  .addContext('Traffic vehicles managed by you will (not) emit radio sound.');
export default page;
