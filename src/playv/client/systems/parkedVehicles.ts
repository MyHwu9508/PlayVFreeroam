import alt from 'alt-client';
import native from 'natives';
import { processFadeIn } from '../utils/entities';
import { LocalStorage } from './localStorage';
import { getRandomInt } from '../../shared/utils/math/numbers';

alt.on('disconnect', () => {
  removeAllParkedVehicles();
});

const cargenerators = JSON.parse(alt.File.read('@assets/dump/cargenerators.json'));

export function generateAllParkedVehicles() {
  for (const generator of cargenerators) {
    const vehicle = new alt.LocalVehicle(
      generator.model,
      LocalStorage.get('parkedVehicles') ? -2147483648 : 2147483647,
      new alt.Vector3(generator.x, generator.y, generator.z),
      new alt.Vector3(0, 0, (generator.heading / 180) * Math.PI),
      true,
      150
    );
    vehicle.setMeta('isParkedVehicle', true);
    vehicle.setMeta('originPos', [new alt.Vector3(generator.x, generator.y, generator.z), new alt.Vector3(0, 0, (generator.heading / 180) * Math.PI)]);
    const color = getRandomInt(0, 159);
    vehicle.setMeta('color', color);
    // await alt.Utils.wait(0);
  }
}

export async function handleParkedVehicle(vehicle: alt.LocalVehicle) {
  await alt.Utils.waitFor(() => vehicle.scriptID !== 0 && native.hasModelLoaded(vehicle.model), 3000);
  native.setEntityAlpha(vehicle.scriptID, 0, false);
  native.setVehicleDoorsLocked(vehicle.scriptID, 2);

  if (vehicle.pos.distanceTo(vehicle.getMeta('originPos')[0]) > 1) {
    vehicle.pos = vehicle.getMeta('originPos')[0];
    vehicle.rot = vehicle.getMeta('originPos')[1];
    native.setVehicleOnGroundProperly(vehicle.scriptID, 5);
  }

  const grounded = native.setVehicleOnGroundProperly(vehicle.scriptID, 5);
  if (!grounded) {
    await alt.Utils.wait(500);
    if (!vehicle?.valid || vehicle.scriptID === 0) return;
    native.setVehicleOnGroundProperly(vehicle.scriptID, 5);
  }
  if (!native.isVehicleOnAllWheels(vehicle.scriptID)) {
    vehicle.destroy();
    return;
  }
  native.setEntityInvincible(vehicle.scriptID, true);
  native.setVehicleColours(vehicle.scriptID, vehicle.getMeta('color'), vehicle.getMeta('color'));
  processFadeIn(vehicle as unknown as alt.Vehicle);
}

function removeAllParkedVehicles() {
  for (const vehicle of alt.Vehicle.all) {
    if (vehicle.hasMeta('isParkedVehicle')) vehicle.destroy();
  }
}

export function toggleAllParkedVehicles(state: boolean) {
  for (const vehicle of alt.Vehicle.all) {
    if (vehicle.hasMeta('isParkedVehicle')) vehicle.dimension = state ? -2147483648 : 2147483647;
  }
}
