import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';

export function createNeonAndLightsPage(vehicle: alt.Vehicle) {
  const page = new Page('Neon & Lights');

  if (vehicle.canBeTuned()) {
    const [_, neonR, neonG, neonB] = native.getVehicleNeonColour(vehicle);

    page.addToggle('Neon', native.getVehicleNeonEnabled(vehicle, 0)).onInput(comp => {
      alt.emitServer('setVehicleAttribute', 'neon', vehicle.remoteID, {
        left: comp.value,
        right: comp.value,
        front: comp.value,
        back: comp.value,
      });
    });

    page
      .addColorPicker('Neon Color', { r: neonR, g: neonG, b: neonB })
      .onInput(comp => {
        const color = comp.value.toRgb();
        native.setVehicleNeonColour(vehicle, color.r, color.g, color.b);
      })
      .onFinished((comp, submitted) => {
        if (!submitted) return;
        const color = comp.value.toRgb();
        alt.emitServer('setVehicleAttribute', 'neonColor', vehicle.remoteID, new alt.RGBA(color.r, color.g, color.b));
      });

    page
      .addNumberSelect('Lights Color', 0, 13, 1, vehicle.getMeta('headlightColor') === 255 ? 13 : vehicle.getMeta('headlightColor') ?? 0)
      .onInput(comp => {
        if (Number(comp.value) === 0) {
          alt.emitServer('runVehicleMethod', 'setMod', vehicle.remoteID, 22, 0);
        } else {
          alt.emitServer('runVehicleMethod', 'setMod', vehicle.remoteID, 22, 1);
        }
        alt.emitServer('setVehicleAttribute', 'headlightColor', vehicle.remoteID, comp.value);
      })
      .addThrottle(100);

    page
      .addNumberSelect('Lights Multiplier', 0, 10, 0.5, vehicle.getMeta('lightsMultiplier') ?? 1)
      .onInput(comp => {
        alt.emitServer('setVehicleAttribute', 'lightsMultiplier', vehicle.remoteID, comp.value);
      })
      .addThrottle(100);
  }

  return page;
}
