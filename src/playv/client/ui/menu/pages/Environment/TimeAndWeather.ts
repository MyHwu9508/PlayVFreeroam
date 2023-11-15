import { weathers } from '../../../../../shared/data/weatherTypes';
import { LocalStorage } from '../../../../systems/localStorage';
import { Page } from '../../framework/Page';
import TimeController from '../../../../scripts/world/time';
import { getLobbySetting } from '../../../../systems/lobby';
import { updateWeather } from '../../../../scripts/world/weather';
import alt from 'alt-client';

const page = new Page('Time & Weather');

const hours = page
  .addNumberSelect('Hours', 0, 23, 1, LocalStorage.get('timeHours'))
  .onInput(comp => {
    LocalStorage.set('timeHours', comp.value);
    TimeController.refreshTime();
  })
  .addContext('Changes to time and weather will only apply, if the lobby option for sync is turned off! Otherwise your changes will be overwritten by the lobby settings');

const time = page
  .addNumberSelect('Minutes', 0, 59, 1, LocalStorage.get('timeMinutes'))
  .onInput(comp => {
    LocalStorage.set('timeMinutes', comp.value);
    TimeController.refreshTime();
  })
  .addContext('Changes to time and weather will only apply, if the lobby option for sync is turned off! Otherwise your changes will be overwritten by the lobby settings');

page.addButton('').addConfig({ line: true, lineColor: 'primary' });

const weather = page
  .addSelect('Weather', weathers, LocalStorage.get('weather'))
  .onInput(comp => {
    LocalStorage.set('weather', comp.value);
    updateWeather();
  })
  .addContext('Changes to time and weather will only apply, if the lobby option for sync is turned off! Otherwise your changes will be overwritten by the lobby settings');

page
  .addToggle('Force Render Snow', LocalStorage.get('forceSnow'))
  .onInput(comp => {
    LocalStorage.set('forceSnow', comp.value);
    updateWeather();
  })
  .addContext('This will force snow to render on the ground, even if the weather is not set to snow. On weather type XMAS snow is forced to render, regardless of this setting!');

page.onBeforeOpen(() => {
  hours.disabled = getLobbySetting('syncTimeOption') !== 'Off';
  time.disabled = getLobbySetting('syncTimeOption') !== 'Off';
  weather.disabled = getLobbySetting('syncWeatherOption') !== 'Off';
});
export default page;
