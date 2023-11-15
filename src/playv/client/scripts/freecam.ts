/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import Quaternion from 'quaternion';
import alt from 'alt-client';
import native from 'natives';
import { webView } from '../ui/view/webView';
import { keybindManager } from '../systems/keybinds';
import { KEYNAMES } from '../../shared/types/keycodes';
import { setFloatingButtons } from '../ui/hud/floatingKeybinds';
import { hideAllHudComponentsThisFrame } from '../ui/gta/misc';
import { moveRelative } from '../../shared/utils/math/vectors';
import { permissions } from '../systems/access/permissions';
import { pushToast } from '../ui/hud/toasts';
//STATE
const UPDATE_TIMEOUT = 50;
let cameraID: number | undefined;
let updateInterval: number | undefined;
let velocity = new alt.Vector3(0, 0, 0);
let speed = 15;
let fov = 68;
let lerpFactor = 1.5;
let moveMode: 'smooth' | 'direct' = 'direct';
let rotMode: 'euler' | 'quat' = 'euler';
let camRotQuat = new Quaternion();
let camRotVelocity = new alt.Vector3(0, 0, 0);
let camRotVelocityActive = false;
let rotationSpeed = 1 + native.getProfileSetting(754) / 10;
let camOverlay = 0;

function resetState() {
  velocity = new alt.Vector3(0, 0, 0);
  camRotQuat = new Quaternion();
  camRotVelocity = new alt.Vector3(0, 0, 0);
  camOverlay = 0;
}

function switchRotationMode() {
  if (rotMode === 'euler') {
    rotMode = 'quat';
    const currentRot = native.getCamRot(cameraID, 2).toRadians();
    camRotQuat = Quaternion.fromEuler(currentRot.z, currentRot.x, currentRot.y, 'ZXY');
  } else {
    rotMode = 'euler';
  }
}

function applyRotation(pitch: number, roll: number, yaw: number): alt.Vector3 {
  if (rotMode === 'euler') {
    const currentRot = native.getCamRot(cameraID, 2);
    let newRot = currentRot.add(pitch, 0, yaw);
    newRot = new alt.Vector3(Math.min(Math.max(newRot.x, -89), 89), 0, newRot.z);
    native.setCamRot(cameraID, newRot.x, 0, newRot.z, 2);
    return newRot;
  } else {
    const vek = new alt.Vector3(pitch, roll, yaw).toRadians();
    camRotQuat = camRotQuat.mul(Quaternion.fromEuler(vek.z, vek.x, vek.y, 'ZXY'));
    camRotQuat = camRotQuat.normalize();
    const euler = camRotQuat.toEuler('ZXY');
    const rot = new alt.Vector3(euler[1], euler[2], euler[0]).toDegrees();
    native.setCamRot(cameraID, rot.x, rot.y, rot.z, 2);
    return rot;
  }
}

function update() {
  const pos = native.getCamCoord(cameraID);
  native.setFocusPosAndVel(pos.x, pos.y, pos.z, 0, 0, 0);
  //newSpeed: number, newFov: number, newLerpFactor: number, newRotMode: 'euler' | 'quat', newCamRotVelocityActive: boolean, newRotationSpeed: number
  webView.emit(
    'freecam:updateState',
    speed,
    fov,
    lerpFactor,
    rotMode,
    camRotVelocityActive,
    rotationSpeed,
    camOverlay,
    moveMode,
  );
}

export function getFreecamState() {
  return cameraID !== undefined;
}

export function setFreecamState(state: boolean) {
  if (state === (cameraID !== undefined)) return;
  webView.emit('freecam:setVisible', state);
  if (updateInterval) {
    alt.clearInterval(updateInterval);
    updateInterval = undefined;
  }
  if (state) {
    const pos = localPlayer.pos;
    const rot = localPlayer.rot;
    cameraID = native.createCamWithParams(
      'DEFAULT_SCRIPTED_CAMERA',
      pos.x,
      pos.y,
      pos.z + 0.5,
      rot.x,
      rot.y,
      rot.z,
      fov,
      true,
      2,
    );
    resetState();
    native.setCamActive(cameraID, true);
    native.renderScriptCams(true, false, 0, true, false, 0);
    native.setCamFov(cameraID, fov);
    const toggleHUDKey = keybindManager.getCurrentKeybind('keybind.toggleHUD');
    const toggleHUDKeyString = KEYNAMES[toggleHUDKey];
    const keybinds = [
      ['W|S', 'Forwards|Backwards'],
      ['A|D', 'Left|Right'],
      ['G', 'Movement smoothing'],
      ['␣', 'Up'],
      ['Ctl', 'Down'],
      ['🖱️', 'Change Speed'],
      ['⇧', 'Boost'],
      ['R|F', 'Acceleration'],
      ['🖱️', 'Zoom'],
      ['V', 'Rotation Mode'],
      ['Q|E', 'Roll'],
      ['Num', 'Camera Rotation'],
      ['X|C', 'Rotation Speed'],
      ['B', 'Rotation Acceleration Mode'],
      ['H', 'Freecam Overlay'],
      [toggleHUDKeyString, 'Toggle HUD'],
    ] as [string, string][];
    setFloatingButtons(keybinds);
    updateInterval = alt.setInterval(update, UPDATE_TIMEOUT);
  } else {
    native.clearFocus();
    native.renderScriptCams(false, false, 0, true, false, 0);
    native.destroyCam(cameraID, false);
    cameraID = undefined;
    setFloatingButtons([]);
  }
}

export function freecamTick() {
  if (!cameraID) return;
  native.disableAllControlActions(0);
  hideAllHudComponentsThisFrame();
  const delta = native.getFrameTime();

  fov -= Number(native.isDisabledControlPressed(0, 237)) * 20 * delta;
  fov += Number(native.isDisabledControlPressed(0, 238)) * 20 * delta;
  fov = Math.min(Math.max(fov, 1), 130);
  native.setCamFov(cameraID, fov);

  //Movement
  let moveZ = Number(native.isDisabledControlPressed(0, 22)); //Space
  moveZ -= Number(native.isDisabledControlPressed(0, 36)); //CTRL
  const moveX = native.getDisabledControlUnboundNormal(0, 218); //A/D
  const moveY = native.getDisabledControlUnboundNormal(0, 219) * -1; //W/S

  let yaw = native.getDisabledControlUnboundNormal(0, 220) * -1 * rotationSpeed; //Mouse Left/Right
  let pitch = native.getDisabledControlUnboundNormal(0, 221) * -1 * rotationSpeed; //Mouse Up/Down

  let roll = Number(native.getDisabledControlUnboundNormal(0, 206)) * 8 * rotationSpeed * delta; //E
  roll -= Number(native.getDisabledControlUnboundNormal(0, 205)) * 8 * rotationSpeed * delta; //Q
  //NumPad controls
  if (yaw === 0 && pitch === 0) {
    yaw = Number(native.isDisabledControlPressed(0, 117)) * 8 * rotationSpeed * delta;
    yaw -= Number(native.isDisabledControlPressed(0, 118)) * 8 * rotationSpeed * delta;
    pitch = Number(native.isDisabledControlPressed(0, 112)) * 8 * rotationSpeed * delta;
    pitch -= Number(native.isDisabledControlPressed(0, 111)) * 8 * rotationSpeed * delta;
    if (roll === 0) {
      roll = Number(native.isDisabledControlPressed(0, 109)) * 8 * rotationSpeed * delta;
      roll -= Number(native.isDisabledControlPressed(0, 108)) * 8 * rotationSpeed * delta;
    }
  }

  //move mode
  if (native.isDisabledControlJustPressed(0, 47)) moveMode = moveMode === 'smooth' ? 'direct' : 'smooth'; //G

  //Speed changes
  rotationSpeed += Number(native.isDisabledControlPressed(0, 79)) * delta; //C
  rotationSpeed -= Number(native.isDisabledControlPressed(0, 73)) * delta; //X
  rotationSpeed = Math.min(Math.max(rotationSpeed, 0.1), 50);
  lerpFactor += Number(native.isDisabledControlPressed(0, 250)) * 0.15 * delta; //R
  lerpFactor -= Number(native.isDisabledControlPressed(0, 251)) * 0.15 * delta; //F
  lerpFactor = Math.min(Math.max(lerpFactor, 0), 10);
  speed += Number(native.isDisabledControlPressed(0, 181)) * 0.5; //scroll up
  speed -= Number(native.isDisabledControlPressed(0, 180)) * 0.5; //scroll down
  speed = Math.max(speed, 0.5);
  const currentSpeed = native.isDisabledControlPressed(0, 21) ? (speed + 4) * 4 : speed;

  //Rotation
  if (native.isDisabledControlJustPressed(0, 0)) switchRotationMode(); //V
  if (native.isDisabledControlJustPressed(0, 29)) camRotVelocityActive = !camRotVelocityActive; //B
  if (native.isDisabledControlJustPressed(0, 74)) camOverlay = (camOverlay + 1) % 3; //H

  if (camRotVelocityActive) {
    camRotVelocity = camRotVelocity.lerp(new alt.Vector3(pitch, roll, yaw), lerpFactor * delta);
  } else {
    camRotVelocity = new alt.Vector3(pitch, roll, yaw);
  }
  const newRot = applyRotation(camRotVelocity.x, camRotVelocity.y, camRotVelocity.z);

  const pos = native.getCamCoord(cameraID);
  const move = new alt.Vector3(moveX, moveY, moveZ).mul(currentSpeed);
  const moveAdjusted = moveRelative(new alt.Vector3(0), move, newRot);
  velocity = velocity.lerp(moveAdjusted, lerpFactor * delta);
  const offset = moveMode === 'smooth' ? velocity.mul(delta) : moveAdjusted.mul(delta);
  const newPos = pos.add(offset);
  native.setCamCoord(cameraID, newPos.x, newPos.y, newPos.z);
}

keybindManager.registerEvent('keybind.freecam', () => {
  const state = getFreecamState();
  if (!permissions.can('freecam') && !state) {
    pushToast('warning', 'You are not allowed to use freecam! Ask the lobby owner for permission!');
    return;
  }
  setFreecamState(!state);
  permissions.setStateActive('freecam', !state);
});
