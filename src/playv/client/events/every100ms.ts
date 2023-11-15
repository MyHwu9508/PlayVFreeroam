import alt from 'alt-client';
import native from 'natives';
import { altvVoiceClientModuleInstance } from '../scripts/voice';
import { canBeNetownerTick } from '../systems/pedSync';
import { calculateAverageFPS } from '../utils/fps';
import { calculateAveragePing } from '../utils/ping';
import { checkForSpawnPedsFleeing } from '../scripts/spawnarea/spawnPed';
import { LocalStorage } from '../systems/localStorage';

alt.setInterval(() => {
  runInterval();
}, 100);

function runInterval() {
  canBeNetownerTick();
  calculateAverageFPS();
  calculateAveragePing();
  checkForSpawnPedsFleeing();

  // log2D.add(10, alt.getMeta('lastCombat').toString());

  const streamedInVehicles = alt.Vehicle.streamedIn;
  for (const vehicle of streamedInVehicles) {
    if (vehicle.getMeta('neverDirty')) native.setVehicleDirtLevel(vehicle, 0);
  }
  altvVoiceClientModuleInstance.talkingTick();

  native.setRadarZoom(LocalStorage.get('minimapZoom'));
}
