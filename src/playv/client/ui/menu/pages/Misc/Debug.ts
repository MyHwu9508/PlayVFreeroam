import alt from 'alt-client';
import { Page } from '../../framework/Page';
import native from 'natives';
import { utils } from '../../../../../shared/utils';

const page = new Page('Debug');

let parkedVehicleTick, vehicleNodesTick, trafficVehicleOwnerTick;

page.addToggle('Draw Parked Vehicle Positions', false).onInput(comp => {
  if (parkedVehicleTick) {
    alt.clearEveryTick(parkedVehicleTick);
    parkedVehicleTick = undefined;
  } else if (comp.value) {
    parkedVehicleTick = alt.everyTick(() => {
      alt.Vehicle.streamedIn.forEach(vehicle => {
        if (vehicle.hasMeta('isParkedVehicle')) {
          alt.Utils.drawText3dThisFrame(JSON.stringify(vehicle.getMeta('originPos')), vehicle.pos, 4, 0.4, new alt.RGBA(255, 255, 255, 255), true, true);
        }
      });
    });
  }
});

page.addToggle('Draw Vehicle Nodes', false).onInput(comp => {
  if (vehicleNodesTick) {
    alt.clearEveryTick(vehicleNodesTick);
    vehicleNodesTick = undefined;
  } else if (comp.value) {
    vehicleNodesTick = alt.everyTick(() => {
      const cameraPos = native.getGameplayCamCoord();
      const searchPos = utils.vector.moveForward(localPlayer.pos, new alt.Vector3(0, 0, localPlayer.rot.z).toRadians(), 0);
      for (let i = 1; i < 50; i++) {
        const [, pos, heading] = native.getNthClosestVehicleNodeWithHeading(searchPos.x, searchPos.y, searchPos.z, i, new alt.Vector3(0), 0, 0, 1, 1, 1);
        const dist = cameraPos.distanceTo(new alt.Vector3(pos.x, pos.y, pos.z));
        const scale = (2 * dist * Math.tan((native.getGameplayCamFov() * Math.PI) / 360)) / 2;
        const [, , flags] = native.getVehicleNodeProperties(pos.x, pos.y, pos.z);
        alt.Utils.drawText3dThisFrame(`${heading.toFixed(0)} ${flags.toString(2).padStart(12, '0')}`, pos, 2, 5 / scale, new alt.RGBA(255, 255, 255, 255), true);
      }
    });
  }
});

page.addToggle('Draw Traffic Vehicle Owner', false).onInput(comp => {
  if (trafficVehicleOwnerTick) {
    alt.clearEveryTick(trafficVehicleOwnerTick);
    trafficVehicleOwnerTick = undefined;
  } else if (comp.value) {
    trafficVehicleOwnerTick = alt.everyTick(() => {
      for (const vehicle of alt.Vehicle.streamedIn) {
        if (!vehicle.valid || !vehicle.getStreamSyncedMeta('T_ped')) continue;
        alt.Utils.drawText3dThisFrame(vehicle.netOwner?.getStreamSyncedMeta('username'), vehicle.pos, 4, 0.35, new alt.RGBA(255, 255, 255, 255), true);
      }
    });
  }
});

export default page;
