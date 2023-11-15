import alt from 'alt-client';
import native from 'natives';
import { hideAllHudComponentsThisFrame } from '../../ui/gta/misc';
import { ConVar } from '../../../shared/conf/ConVars';
import { spawnLocations } from '../../../shared/conf/SpawnConfig';

let loginCamera: number;
let everyTickInterval: number;

export async function startLoginScene() {
  if (ConVar.DEBUG.FAST_LOGIN) return;
  await alt.Utils.loadMapArea(spawnLocations.default.cameraPosition, 30, 25000).catch(err => {
    alt.logError(err);
  });
  alt.FocusData.overrideFocus(spawnLocations.default.cameraPosition);
  everyTickInterval = alt.everyTick(() => {
    hideAllHudComponentsThisFrame();
  });
  native.setEntityAlpha(localPlayer, 0, true);

  loginCamera = native.createCamWithParams(
    'DEFAULT_SCRIPTED_CAMERA',
    spawnLocations.default.cameraPosition.x,
    spawnLocations.default.cameraPosition.y,
    spawnLocations.default.cameraPosition.z,
    spawnLocations.default.cameraRotation.x,
    spawnLocations.default.cameraRotation.y,
    spawnLocations.default.cameraRotation.z,
    70,
    true,
    2
  );
  native.setCamActive(loginCamera, true);
  native.renderScriptCams(true, false, 0, true, false, 0);
}

export async function stopLoginScene() {
  alt.FocusData.clearFocus();

  //end camera
  if (loginCamera) {
    native.renderScriptCams(false, false, 0, true, false, 0);
    native.setCamActive(loginCamera, false);
    native.destroyCam(loginCamera, true);
  }

  if (everyTickInterval) {
    alt.clearEveryTick(everyTickInterval);
  }

  native.resetEntityAlpha(localPlayer);
}
