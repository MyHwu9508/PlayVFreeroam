/* eslint-disable @typescript-eslint/no-explicit-any */
import * as alt from 'alt-client';
import * as native from 'natives';
import { CharEditorData, CharEditorMetaData } from '../../../shared/types/charCreatorData';
import { pedCharCreatorPlayAnim, spawnCharCreatorPed, updatePedChar } from './charSync';
import { getMaxOverlayIndece } from './charCreatorValues';
import { SEATING_POSITION, CAMERA_POSITION, MAX_PEDLOOK_ANGLE, CAMERA_FOVBOUNDS, CAMERA_PRESETS } from './charCreatorConfig';
import { webView } from '../view/webView';
import { setFocus } from '../focus';
import _ from 'lodash';
import { utils } from '../../../shared/utils';
import { permissions } from '../../systems/access/permissions';
import { keybindManager } from '../../systems/keybinds';

export type CharCreatorStatus = 'DISCARD' | 'COPY' | 'COMMIT';

let isCreatorOpen = false;
let pedID: number | null = null;
let cameraID: number | null = null;
let lastDataReceived: CharEditorData | null = null;
let camPos = {
  x: CAMERA_POSITION.x,
  y: CAMERA_POSITION.y,
  z: CAMERA_POSITION.z,
  rotX: CAMERA_POSITION.rotX,
  rotY: CAMERA_POSITION.rotY,
  rotZ: CAMERA_POSITION.rotZ,
};
let pedPos = {
  x: SEATING_POSITION.x,
  y: SEATING_POSITION.y,
  z: SEATING_POSITION.z,
  heading: SEATING_POSITION.heading,
};
const cameraRotationValues = {
  x: 180,
  y: 0,
};
const currentLookAngle = {
  x: 0,
  y: 0,
};
let CAMERA_OFFSET = new alt.Vector3(-0.13, -1.5, 0);
let camFOV = 20;
let xUpdateIntervall: number | null = null;
let zoomUpdateInterval: number | null = null;
let isViewingTattoos = false;
let hoveredTattoo: [number, number] | undefined = undefined;

alt.on('disconnect', () => {
  if (pedID) native.deletePed(pedID);
});

export async function charCreatorEdit(data: CharEditorData, meta: CharEditorMetaData) {
  if (!data.female && data.hairIndex > 36) data.hairIndex -= 35;
  if (data.female && data.hairIndex > 38) data.hairIndex -= 37;
  startCharCreator(data, meta);
  return new Promise<{ data: CharEditorData; meta: CharEditorMetaData; newChar: boolean } | undefined>(editorResolver);
}

function editorResolver(resolve: (value: any) => void) {
  alt.once('charCreator:finishEdit', (status: CharCreatorStatus, data: CharEditorData, meta: CharEditorMetaData) => {
    if (status === 'DISCARD') {
      resolve(undefined);
      return;
    }
    resolve({ data, meta, newChar: status === 'COPY' });
  });
}

export function abortCharCreator() {
  if (!isCreatorOpen) throw new Error('Trying to abort character creator when it is not open');
  handleFinishEdit('DISCARD', undefined);
}

async function startCharCreator(data: CharEditorData, meta: CharEditorMetaData) {
  if (isCreatorOpen) throw new Error('Trying to open character creator when it is already open');
  permissions.setStateActive('uiActive', true);
  keybindManager.isBlocked = true;
  native.doScreenFadeOut(0);
  isCreatorOpen = true;
  lastDataReceived = data;
  // alt.requestIpl('vw_casino_penthouse'); maybe crashes?
  native.requestIpl('vw_casino_penthouse');
  const interiorID = native.getInteriorAtCoords(976.6364, 70.29476, 115.1641);
  if (native.isValidInterior(interiorID)) {
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Spa_Bar_Open');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Media_Bar_Open');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Arcade_Retro');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Bar_Clutter');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Clutter_03');
    native.activateInteriorEntitySet(interiorID, 'Set_pent_bar_light_02');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Pattern_09');
    native.setInteriorEntitySetTintIndex(interiorID, 'Set_Pent_Pattern_09', 2);
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Tint_Shell');
    native.setInteriorEntitySetTintIndex(interiorID, 'Set_Pent_Tint_Shell', 2);
    native.refreshInterior(interiorID);
  }
  // await safePlayerTeleport(0, new alt.Vector3(954, 15, 130), 0);
  alt.FocusData.overrideFocus(new alt.Vector3(954, 15, 130));
  pedID = await spawnCharCreatorPed(new alt.Vector3(pedPos.x, pedPos.y, pedPos.z), pedPos.heading, data.female);

  webView.emit('charCreator:updateIndece', getMaxOverlayIndece());
  alt.setTimeout(() => {
    native.doScreenFadeIn(100);
    webView.emit('charCreator:open', data, meta);
  }, 200);

  alt.toggleGameControls(false);
  native.displayRadar(false);

  setFocus(true, false, false, true);
  registerHandlers();
  handleFacemouseMovement(0, 0);

  cameraID = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', camPos.x, camPos.y, camPos.z, camPos.rotX, camPos.rotY, camPos.rotZ, camFOV, true, 0);
  updatePedChar(pedID, data);
  updateCamera();
  native.setCamActive(cameraID, true);
  native.renderScriptCams(true, false, 0, true, false, 0);
}

function registerHandlers() {
  webView.on('charCreator:syncData', handleSync);
  webView.on('charCreator:faceMove', handleFacemouseMovement);
  webView.on('charCreator:cameraY', handleCameraYMovment);
  webView.on('charCreator:cameraXIncrement', handleCameraXIncrement);
  webView.on('charCreator:cameraZoom', handleCameraZoom);
  webView.on('charCreator:cameraZoomIncrement', handleZoomButton);
  webView.on('charCreator:cameraPreset', handleCameraPreset);
  webView.on('characterCreator:finishEdit', handleFinishEdit);
  webView.on('charCreator:mask', handleMask);
  webView.on('charCreator:tattooState', setTattooState);
  webView.on('charCreator:hoverTattoo', hoverTattoo);
}

function unregisterHandlers() {
  webView.off('charCreator:syncData', handleSync);
  webView.off('charCreator:faceMove', handleFacemouseMovement);
  webView.off('charCreator:cameraY', handleCameraYMovment);
  webView.off('charCreator:cameraXIncrement', handleCameraXIncrement);
  webView.off('charCreator:cameraZoom', handleCameraZoom);
  webView.off('charCreator:cameraZoomIncrement', handleZoomButton);
  webView.off('charCreator:cameraPreset', handleCameraPreset);
  webView.off('characterCreator:finishEdit', handleFinishEdit);
  webView.off('charCreator:mask', handleMask);
  webView.off('charCreator:tattooState', setTattooState);
  webView.off('charCreator:hoverTattoo', hoverTattoo);
}

async function handleSync(data: CharEditorData) {
  if (!pedID) return;
  if (!data.female && data.hairIndex > 36) data.hairIndex += 35;
  if (data.female && data.hairIndex > 38) data.hairIndex += 37;
  if (data.female === native.isPedMale(pedID)) {
    native.deletePed(pedID);
    pedID = await spawnCharCreatorPed(new alt.Vector3(pedPos.x, pedPos.y, pedPos.z), pedPos.heading, data.female);
  }
  updatePedChar(pedID, data, hoveredTattoo);
  lastDataReceived = data;
}

function hoverTattoo(hover: [number, number] | undefined) {
  if (!pedID) return;
  hoveredTattoo = hover;
  updatePedChar(pedID, lastDataReceived, hover);
}
function setTattooState(state: boolean) {
  if (state) {
    pedPos = {
      x: 954.5,
      y: 14.3,
      z: 116.36418151855469,
      heading: 340,
    };
    camPos = {
      x: pedPos.x,
      y: pedPos.y,
      z: pedPos.z + 1.2,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
    };
    CAMERA_OFFSET = new alt.Vector3(-0.13, -1.9, 0);
    camFOV = 70;
    native.setCamFov(cameraID, camFOV);
    pedCharCreatorPlayAnim(pedID, true);
  } else {
    if (isViewingTattoos) {
      pedCharCreatorPlayAnim(pedID);
      camFOV = 20;
      native.setCamFov(cameraID, camFOV);
    }
    pedPos = {
      x: SEATING_POSITION.x,
      y: SEATING_POSITION.y,
      z: SEATING_POSITION.z,
      heading: SEATING_POSITION.heading,
    };
    camPos = {
      x: CAMERA_POSITION.x,
      y: CAMERA_POSITION.y,
      z: CAMERA_POSITION.z,
      rotX: CAMERA_POSITION.rotX,
      rotY: CAMERA_POSITION.rotY,
      rotZ: CAMERA_POSITION.rotZ,
    };
    CAMERA_OFFSET = new alt.Vector3(-0.13, -1.5, 0);
  }
  updateCamera();
  updatePedChar(pedID, lastDataReceived);
  native.setEntityCoords(pedID, pedPos.x, pedPos.y, pedPos.z, false, false, false, false);
  isViewingTattoos = state;
}

function handleFacemouseMovement(x: number, y: number) {
  if (!pedID) return;
  currentLookAngle.x += x * 60;
  currentLookAngle.y -= y * 120;
  currentLookAngle.x = _.clamp(currentLookAngle.x, -MAX_PEDLOOK_ANGLE.x, MAX_PEDLOOK_ANGLE.x);
  currentLookAngle.y = _.clamp(currentLookAngle.y, -MAX_PEDLOOK_ANGLE.y, MAX_PEDLOOK_ANGLE.y);
  const lookPos = utils.vector.moveForward(new alt.Vector3(pedPos.x, pedPos.y, pedPos.z), new alt.Vector3(currentLookAngle.y, 0, pedPos.heading + currentLookAngle.x), 5);
  native.taskLookAtCoord(pedID, lookPos.x, lookPos.y, lookPos.z, Number.MAX_SAFE_INTEGER, 2, 2);
}

function handleCameraYMovment(y: number) {
  cameraRotationValues.y = -y;
  updateCamera();
}

function handleCameraXIncrement(increment: number) {
  if (xUpdateIntervall) {
    alt.clearInterval(xUpdateIntervall);
    xUpdateIntervall = null;
  }
  if (increment !== 0) {
    xUpdateIntervall = alt.setInterval(() => {
      cameraRotationValues.x += increment / 2;
      updateCamera();
    }, 15);
  }
}

function handleZoomButton(zoomIncrement: number) {
  if (zoomUpdateInterval) {
    alt.clearInterval(zoomUpdateInterval);
    zoomUpdateInterval = null;
  }
  if (zoomIncrement !== 0) {
    zoomUpdateInterval = alt.setInterval(() => {
      handleCameraZoom(zoomIncrement);
    }, 30);
  }
}

function handleCameraZoom(zoomDelta: number) {
  camFOV += zoomDelta;
  camFOV = _.clamp(camFOV, CAMERA_FOVBOUNDS.min, CAMERA_FOVBOUNDS.max);
  native.setCamFov(cameraID, camFOV);
}

function handleCameraPreset(preset: number) {
  if (preset < 0 || preset >= CAMERA_PRESETS.length) return;
  const presetData = CAMERA_PRESETS[preset];
  cameraRotationValues.x = presetData.x;
  cameraRotationValues.y = presetData.y;
  camFOV = presetData.fov;
  native.setCamFov(cameraID, camFOV);
  updateCamera();
  webView.emit('charCreator:setYval', -cameraRotationValues.y);
}

function updateCamera() {
  if (!cameraID) return;
  const newCamRot = new alt.Vector3(camPos.rotX + cameraRotationValues.y, camPos.rotY, camPos.rotZ + cameraRotationValues.x);
  native.setCamRot(cameraID, newCamRot.x, newCamRot.y, newCamRot.z, 2);
  const newPos = utils.vector.moveRelative(new alt.Vector3(camPos.x, camPos.y, camPos.z), CAMERA_OFFSET, newCamRot);
  native.setCamCoord(cameraID, newPos.x, newPos.y, newPos.z);
}

function handleFinishEdit(status: CharCreatorStatus, meta: CharEditorMetaData) {
  unregisterHandlers();
  native.renderScriptCams(false, false, 0, true, false, 0);
  native.setCamActive(cameraID, false);
  native.destroyCam(cameraID, true);
  native.deletePed(pedID);
  native.clearFocus();
  pedID = null;
  cameraID = null;
  isCreatorOpen = false;
  webView.emit('charCreator:close');
  setFocus(false);
  alt.FocusData.clearFocus();
  native.displayRadar(true);
  alt.toggleGameControls(true);
  alt.emitRaw('charCreator:finishEdit', status, lastDataReceived, meta);
  lastDataReceived = null;
  permissions.setStateActive('uiActive', false);
  keybindManager.isBlocked = false;
  native.removeIpl('vw_casino_penthouse'); //TODO tryfix crash
}

function handleMask(mask: number) {
  if (!pedID) return;
  native.setPedComponentVariation(pedID, 1, mask, 0, 0);
}
