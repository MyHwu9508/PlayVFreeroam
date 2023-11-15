import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';
import _ from 'lodash';
import { WheelStanceData } from '../../../../../../shared/types/types';

export function createRimsAndTiresPage(vehicle: alt.Vehicle) {
  const page = new Page('Rims & Tires');

  const [, tireSmokeR, tireSmokeG, tireSmokeB] = native.getVehicleTyreSmokeColor(vehicle, 0, 0, 0);
  let defaultStance = {};
  for (let i = 0; i < vehicle.wheelsCount; i++) {
    // store default values because yes
    defaultStance[i] = {
      camber: vehicle.getWheelCamber(i).toFixed(2),
      height: vehicle.getWheelHeight(i).toFixed(2),
      width: vehicle.getWheelTrackWidth(i).toFixed(2),
    };
  }

  page
    .addColorPicker('Tire Smoke Color', { r: tireSmokeR, g: tireSmokeG, b: tireSmokeB })
    .onInput(comp => {
      const color = comp.value.toRgb();
      native.setVehicleTyreSmokeColor(vehicle, color.r, color.g, color.b);
    })
    .onFinished((comp, submitted) => {
      if (submitted) {
        const color = comp.value.toRgb();
        // native.setVehicleTyreSmokeColor(vehicle, color.r, color.g, color.b);
        alt.emitServer('setVehicleAttribute', 'tireSmokeColor', vehicle.remoteID, new alt.RGBA(color.r, color.g, color.b, 255));
      }
    });

  page.addToggle('Wheel Inscription', vehicle.getMeta('wheelInscription') ?? false, 'checkbox').onInput(comp => {
    vehicle.setMeta('wheelInscription', comp.value);
    alt.emitServer('setVehicleAttribute', 'customTires', vehicle.remoteID, comp.value);
  });

  page
    .addNumberSelect('Rim Category', 0, 12, 1, vehicle.getMeta('rimCategory') ?? 0)
    .onInput(comp => {
      vehicle.setMeta('rimCategory', Number(comp.value));
      alt.emitServer('runVehicleMethod', 'setWheels', vehicle.remoteID, comp.value, vehicle.getMeta('rimIndex') ?? 0);
    })
    .addThrottle(100);

  page
    .addNumberSelect('Rim Index', 0, 250, 1, vehicle.getMeta('rimIndex') ?? 0)
    .onInput(comp => {
      vehicle.setMeta('rimIndex', Number(comp.value));
      alt.emitServer('runVehicleMethod', 'setWheels', vehicle.remoteID, vehicle.getMeta('rimCategory') ?? 0, comp.value);
    })
    .addThrottle(100);

  page
    .addNumberSelect('Rim Color', 0, 160, 1, vehicle.getMeta('rimColor') ?? 0)
    .onInput(comp => {
      vehicle.setMeta('rimColor', Number(comp.value));
      alt.emitServer('setVehicleAttribute', 'wheelColor', vehicle.remoteID, comp.value);
    })
    .addThrottle(100);

  page.addButton('');

  page.addConfirm('Reset Stance').onInput(comp => {
    for (let i = 0; i < Object.keys(defaultStance).length; i++) {
      vehicle.setWheelCamber(i, defaultStance[i].camber);
      vehicle.setWheelHeight(i, defaultStance[i].height);
      vehicle.setWheelTrackWidth(i, defaultStance[i].width);
    }
    camber.value = Number(defaultStance[0].camber);
    height.value = Number(defaultStance[0].height);
    trackwidth.value = Number(defaultStance[0].width);
    sendStanceChangesToServer(vehicle);
  });

  const camber = page.addNumberSelect('Wheel Camber', -2, 2, 0.01, Number(vehicle.getWheelCamber(0).toFixed(2))).onInput(comp => {
    for (let i = 0; i < vehicle.wheelsCount; i++) vehicle.setWheelCamber(i, comp.value);
    sendStanceChangesToServer(vehicle);
  });

  const height = page.addNumberSelect('Wheel Height', -2, 2, 0.01, Number(vehicle.getWheelHeight(0).toFixed(2))).onInput(comp => {
    for (let i = 0; i < vehicle.wheelsCount; i++) vehicle.setWheelHeight(i, comp.value);
    sendStanceChangesToServer(vehicle);
  });

  const trackwidth = page.addNumberSelect('Track Width', -2, 2, 0.01, Number(vehicle.getWheelTrackWidth(0).toFixed(2))).onInput(comp => {
    for (let i = 0; i < vehicle.wheelsCount; i++) vehicle.setWheelTrackWidth(i, comp.value);
    sendStanceChangesToServer(vehicle);
  });
  return page;
}

const sendStanceChangesToServer = _.throttle((vehicle: alt.Vehicle) => {
  const wheelStanceData: WheelStanceData = [[], [], []];

  for (let i = 0; i < vehicle.wheelsCount; i++) {
    wheelStanceData[0][i] = vehicle.getWheelCamber(i);
    wheelStanceData[1][i] = vehicle.getWheelHeight(i);
    wheelStanceData[2][i] = vehicle.getWheelTrackWidth(i);
  }

  alt.emitServerRaw('syncWheelStance', vehicle.remoteID, wheelStanceData);
}, 1000);
