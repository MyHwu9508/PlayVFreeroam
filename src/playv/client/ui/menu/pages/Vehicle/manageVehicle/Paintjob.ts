import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';

export function createPaintjobPage(vehicle: alt.Vehicle) {
  const page = new Page('Paintjob');
  const [, primaryR, primaryG, primaryB] = native.getVehicleCustomPrimaryColour(vehicle);
  const [, secondaryR, secondaryG, secondaryB] = native.getVehicleCustomSecondaryColour(vehicle);

  page
    .addColorPicker('Primary Color RGB', { r: primaryR, g: primaryG, b: primaryB })
    .onInput(comp => {
      const color = comp.value.toRgb();
      native.setVehicleCustomPrimaryColour(vehicle, color.r, color.g, color.b);
    })
    .onFinished((comp, confirmed) => {
      if (confirmed) {
        const color = comp.value.toRgb();
        alt.emitServer('setVehicleAttribute', 'customPrimaryColor', vehicle.remoteID, new alt.RGBA(color.r, color.g, color.b));
      }
    });

  page
    .addColorPicker('Secondary Color RGB', { r: secondaryR, g: secondaryG, b: secondaryB })
    .onInput(comp => {
      const color = comp.value.toRgb();
      native.setVehicleCustomSecondaryColour(vehicle, color.r, color.g, color.b);
    })
    .onFinished((comp, confirmed) => {
      if (confirmed) {
        const color = comp.value.toRgb();
        alt.emitServer('setVehicleAttribute', 'customSecondaryColor', vehicle.remoteID, new alt.RGBA(color.r, color.g, color.b));
      }
    });

  page
    .addNumberSelect('Primary Base Color', 0, 242, 1, vehicle.getMeta('primaryBaseColor') ?? 0)
    .onInput(comp => {
      vehicle.setMeta('primaryBaseColor', Number(comp.value));
      alt.emitServer('setVehicleAttribute', 'primaryColor', vehicle.remoteID, comp.value);
    })
    .addContext(
      'For example, set this color to 120 and THEN set an RGB color to have a chrome effect. You can also create matte & glossy shades this way. But ATTENTION! This setting resets your current RGB color!'
    )
    .addThrottle(100);

  page
    .addNumberSelect('Secondary Base Color', 0, 242, 1, vehicle.getMeta('secondaryBaseColor') ?? 0)
    .onInput(comp => {
      vehicle.setMeta('secondaryBaseColor', Number(comp.value));
      alt.emitServer('setVehicleAttribute', 'secondaryColor', vehicle.remoteID, comp.value);
    })
    .addContext(
      'For example, set this color to 120 and THEN set an RGB color to have a chrome effect. You can also create matte & glossy shades this way. But ATTENTION! This setting resets your current RGB color!'
    )
    .addThrottle(100);

  page
    .addNumberSelect('Pearl Color', 0, 242, 1, vehicle.getMeta('pearlColor') ?? 0)
    .onInput(comp => {
      vehicle.setMeta('pearlColor', Number(comp.value));
      alt.emitServer('setVehicleAttribute', 'pearlColor', vehicle.remoteID, comp.value);
    })
    .addThrottle(100);

  page
    .addNumberSelect('Interior Color', 0, 242, 1, native.getVehicleExtraColour5(vehicle, 0)[1] ?? 0)
    .onInput(comp => {
      alt.emitServer('setVehicleAttribute', 'interiorColor', vehicle.remoteID, comp.value);
    })
    .addThrottle(100);

  page
    .addNumberSelect('Dashboard Color', 0, 242, 1, native.getVehicleExtraColour6(vehicle, 0)[1] ?? 0)
    .onInput(comp => {
      alt.emitServer('setVehicleAttribute', 'dashboardColor', vehicle.remoteID, comp.value);
    })
    .addThrottle(100);

  return page;
}
