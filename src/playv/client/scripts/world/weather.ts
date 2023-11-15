import alt from 'alt-client';
import native from 'natives';
import { getLobbySetting } from '../../systems/lobby';
import { LocalStorage } from '../../systems/localStorage';

// Note that unlike most of the other weather natives, this native takes the hash of the weather name, not the plain string. These are the weather names and their hashes:
let currentWeather: string;
alt.onServer('syncWeather', (oldWeather: string, newWeather: string, percentWeather2: number) => {
  currentWeather = newWeather;
  if (getLobbySetting('syncWeatherOption') !== 'Server') return;
  if (percentWeather2 >= 1) {
    setWeather(newWeather);
  } else {
    native.setCurrWeatherState(alt.hash(oldWeather), alt.hash(newWeather), percentWeather2);
  }
});

export function setWeather(weather: string) {
  native.setWeatherTypeNowPersist(weather);
  if (weather === 'XMAS') {
    alt.setConfigFlag('FORCE_RENDER_SNOW', true);
    native.useSnowWheelVfxWhenUnsheltered(true);
    native.useSnowFootVfxWhenUnsheltered(true);
    native.requestScriptAudioBank('ICE_FOOTSTEPS', false, 0);
    native.requestScriptAudioBank('SNOW_FOOTSTEPS', false, 0);

    native.requestNamedPtfxAsset('core_snow');

    let timer = alt.setInterval(() => {
      if (native.hasNamedPtfxAssetLoaded('core_snow')) {
        native.useParticleFxAsset('core_snow');
        alt.clearInterval(timer);
      }
    }, 1);
  } else {
    alt.setConfigFlag('FORCE_RENDER_SNOW', LocalStorage.get('forceSnow'));
    native.useSnowWheelVfxWhenUnsheltered(false);
    native.useSnowFootVfxWhenUnsheltered(false);
  }
}

export function updateWeather() {
  if (getLobbySetting('syncWeatherOption') === 'Server') {
    setWeather(currentWeather);
  } else if (getLobbySetting('syncWeatherOption') === 'Lobby') {
    setWeather(getLobbySetting('weather'));
  } else {
    alt.logDebug('Setting weather to local storage ' + LocalStorage.get('weather'));
    setWeather(LocalStorage.get('weather'));
  }
}
