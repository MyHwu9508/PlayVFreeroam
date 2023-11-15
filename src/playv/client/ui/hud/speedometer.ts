import alt from 'alt-client';
import native from 'natives';
import { LocalStorage } from '../../systems/localStorage';
import { webView } from '../view/webView';
import { DefaultSpeedometerConfig } from '../../../shared/conf/DefaultSpeedometer';

const player = alt.Player.local;

export async function initSpeedometer() {
  await alt.Utils.waitFor(() => alt.getMeta('webViewReady') === true, 30000);
  const conf = LocalStorage.get('speedometerConfig');
  webView.emit('updateSpeedometerConfig', conf);
}

alt.setInterval(() => {
  if (!player.vehicle) return;
  if (LocalStorage.get('speedometerConfig').mode === -1) return; // if set to none > not uploading to ui
  webView.emit('updateSpeedometer', {
    speed: native.getEntitySpeed(player.vehicle),
    rpm: player.vehicle.engineOn === true ? player.vehicle.rpm : 0,
    gear: player.vehicle.gear,
    lightState: native.getVehicleLightsState(player.vehicle, true, true)[1],
  });
}, 150);

alt.on('leftVehicle', () => {
  webView.emit('toggleSpeedometer', false);
});

alt.on('enteredVehicle', () => {
  webView.emit('toggleSpeedometer', true);
});

export function toggleSpeedometer(state) {
  webView.emit('toggleSpeedometer', state);
}

export function updateSpeedometerConfig(key, value) {
  const conf = LocalStorage.get('speedometerConfig');
  conf[key] = value;
  LocalStorage.set('speedometerConfig', conf);
  webView.emit('updateSpeedometerConfig', conf);
}

export function resetSpeedometerConfig() {
  LocalStorage.set('speedometerConfig', DefaultSpeedometerConfig);
  webView.emit('updateSpeedometerConfig', DefaultSpeedometerConfig);
}
