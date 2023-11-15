//executed each time you join the server ehehe

import alt from 'alt-client';
import native, { deactivateInteriorEntitySet } from 'natives';
import { keybindManager } from '../systems/keybinds';
import { LocalStorage } from '../systems/localStorage';
import { initWorldObjectsAndDoors, loadDefaultIPLs } from './world/ipls';
import { createSpawnPed } from './spawnarea/spawnPed';
import { setAmbientSound } from './world/ambientSound';
import { ConVar } from '../../shared/conf/ConVars';
import { generateAllParkedVehicles } from '../systems/parkedVehicles';
import { spawnSpawnFlag } from './spawnarea/flag';
import { createMusicbox } from './spawnarea/musicBox';
import { defaultConfig } from '../../shared/conf/StorageKeys';
import { setHudState } from '../ui/hud/misc';
import { applyMapdataFix } from '../utils/maximapDataFix';

export async function runStartupScript() {
  log('login', 'startup script started');
  native.doScreenFadeOut(0);

  await alt.Utils.wait(3000); //for for loginscreen to be removed, then proceed with login > .ymap lags > from 500ms to 3s
  await alt.Utils.requestModel('mp_m_freemode_01', 10000000);
  await alt.Utils.requestModel('mp_f_freemode_01', 10000000);

  //Reset when no _version in place >migrate from old playv
  if (!LocalStorage.has('_version') || LocalStorage.get('_version') < ConVar.LOGIN.CURRENT_TOS_VERSION) {
    alt.log('RESETTING LOCALSTORAGE', LocalStorage.get('_version'));
    alt.LocalStorage.clear();
    LocalStorage.save();
    LocalStorage.set('_version', defaultConfig._version); //set new version
  }

  if (LocalStorage.get('parkedVehicles')) {
    generateAllParkedVehicles();
  }

  alt.setConfigFlag('DISABLE_VEHICLE_ENGINE_SHUTDOWN_ON_LEAVE', true);
  alt.setConfigFlag('DISABLE_PED_PROP_KNOCK_OFF', false);
  alt.setConfigFlag('DISABLE_IDLE_CAMERA', false);

  native.setBigmapActive(LocalStorage.get('bigMinimap'), false);

  alt.setMeta('lastCombat', 0);

  //Cayo Perico blip
  const blip = new alt.PointBlip(5943.5679611650485, -6272.114833599767, 2);
  blip.alpha = 0;

  native.setGhostAlpha(254); //Passive Mode 100% alpha instead of gtao 50%
  spawnSpawnFlag();

  if (alt.debug) {
    alt.log('registering debug keys');
    keybindManager.registerEvent('keybind.reconnect', () => {
      if (!alt.getMeta('hasWebviewFocus') && !alt.isConsoleOpen()) new alt.WebView('http://127.0.0.1:9223/reconnect');
    });
  }

  native.requestStreamedTextureDict('mp_gamer_info', true); //load dict for chat icons
  native.requestAdditionalText('FMMC', 1); //Load dictionary for weapon texts

  createSpawnPed();
  createMusicbox();

  setAmbientSound(LocalStorage.get('ambientsound'));

  alt.setWatermarkPosition(LocalStorage.get('uiWatermarkPosition'));

  //startup world things for login
  //   native.setClockTime(14, 0, 0);
  //   native.pauseClock(true);
  //   setWeather('EXTRASUNNY');

  loadDefaultIPLs();
  initWorldObjectsAndDoors();

  //stats TODO toggleable
  alt.setStat('stamina', 100);
  alt.setStat('strength', 100);
  alt.setStat('lung_capacity', 100);
  alt.setStat('wheelie_ability', 100);
  alt.setStat('flying_ability', 100);
  alt.setStat('shooting_ability', 100);
  alt.setStat('stealth_ability', 100);

  alt.setMsPerGameMinute(ConVar.TIME.MS_PER_MINUTE);

  alt.setConfigFlag('DISABLE_PED_PROP_KNOCK_OFF', true);
  alt.setConfigFlag('DISABLE_IDLE_CAMERA', true);
  registerMiscKeybinds();
  loadInteriorSets();
  applyMapdataFix();
}

function registerMiscKeybinds() {
  keybindManager.registerEvent('keybind.RStarRecording', () => {
    if (native.isReplayRecording()) {
      native.stopReplayRecording();
    } else {
      native.startReplayRecording(1);
    }
  });

  keybindManager.registerEvent('keybind.toggleVehicleSiren', () => {
    if (!localPlayer.vehicle || localPlayer.seat !== 1) return;
    if (!localPlayer.vehicle.isEmergencyVehicle()) return;
    alt.emitServerRaw('setVehicleSirenSound', localPlayer.vehicle.remoteID, !localPlayer.vehicle.getStreamSyncedMeta('mutedSiren'));
  });

  keybindManager.registerEvent('keybind.toggleHUD', () => {
    alt.setMeta('showHud', !(alt.getMeta('showHud') ?? true));
    setHudState(alt.getMeta('showHud'));
  });
}

function loadInteriorSets() {
  //Avenger Interior

  const interiorID = native.getInteriorAtCoords(-880.0, -2770.0, -50.0);

  deactivateInteriorEntitySet(interiorID, 'weapons_mod');
  deactivateInteriorEntitySet(interiorID, 'touch_screen');
  deactivateInteriorEntitySet(interiorID, 'control_2');

  native.activateInteriorEntitySet(interiorID, 'control_1');
  native.activateInteriorEntitySet(interiorID, 'gold_bling');
  native.activateInteriorEntitySet(interiorID, 'seat_no_screen');
  native.activateInteriorEntitySet(interiorID, 'shell_tint');
  native.activateInteriorEntitySet(interiorID, 'thruster_dock');
  // native.activateInteriorEntitySet(interiorID, 'touch_screen');
  native.activateInteriorEntitySet(interiorID, 'vehicle_mod');
  native.activateInteriorEntitySet(interiorID, 'weapons_mod');

  native.setInteriorEntitySetTintIndex(interiorID, 'shell_tint', 9);
  native.setInteriorEntitySetTintIndex(interiorID, 'control_2', 9);
  native.setInteriorEntitySetTintIndex(interiorID, 'thruster_dock', 9);
  native.setInteriorEntitySetTintIndex(interiorID, 'vehicle_mod', 9);
  native.setInteriorEntitySetTintIndex(interiorID, 'weapons_mod', 9);
  native.setInteriorEntitySetTintIndex(interiorID, 'shell_tint', 9);
}
