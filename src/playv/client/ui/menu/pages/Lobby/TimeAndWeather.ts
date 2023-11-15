import { Page } from '../../framework/Page';
import alt from 'alt-client';
import { NumberSelect } from '../../framework/components/NumberSelect';
import { LobbySettings, SyncOptions } from '../../../../../shared/types/lobby';
import native from 'natives';
import { weathers } from '../../../../../shared/data/weatherTypes';
import { Select } from '../../framework/components/Select';

const page = new Page('Time & Weather');
let minutesComponent: NumberSelect;
let hoursComponent: NumberSelect;
let weatherComponent: Select;
let lobbySettings: LobbySettings;
let lobbyPermissions: string[];

page.onBeforeOpen(async () => {
  page.removeComponentsAfter(-1);
  await generateContent();
});

async function generateContent() {
  lobbySettings = (await alt.emitRpc('getLobbySettings')) as LobbySettings;
  lobbyPermissions = (await alt.emitRpc('getLobbyPermissions')) as string[];

  page
    .addSelect('Sync Time With', SyncOptions as unknown as string[], lobbySettings.syncTimeOption)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'syncTimeOption', comp.value);
      updatePageContents();
    })
    .addContext('This will sync the time with the server, lobby, or off. Off means everyone can choose their own time in the environment menu!')
    .addThrottle(200);

  hoursComponent = page
    .addNumberSelect('Time Hours', 0, 23, 1, lobbySettings.timeHours)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'timeHours', Number(comp.value));
    })
    .addThrottle(200);
  minutesComponent = page.addNumberSelect('Time Minutes', 0, 59, 1, lobbySettings.timeMinutes).onInput(async comp => {
    const res = await alt.emitRpc('setLobbySetting', 'timeMinutes', Number(comp.value));
  });
  page.addButton('').addConfig({ line: true, lineColor: 'primary' });

  page
    .addSelect('Sync Weather With', SyncOptions as unknown as string[], lobbySettings.syncWeatherOption)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'syncWeatherOption', comp.value);
      updatePageContents();
    })
    .addContext('This will sync the weather with the server, lobby, or off. Off means everyone can choose their own weather in the environment menu!')
    .addThrottle(200);

  weatherComponent = page
    .addSelect('Weather', weathers, lobbySettings.weather)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'weather', comp.value);
    })
    .addThrottle(200);

  updatePageContents(false);
}

async function updatePageContents(updateData = true) {
  if (!lobbySettings) return;
  if (updateData) {
    lobbySettings = (await alt.emitRpc('getLobbySettings')) as LobbySettings;
    lobbyPermissions = (await alt.emitRpc('getLobbyPermissions')) as string[];
  }
  hoursComponent.disabled = lobbySettings.syncTimeWithServer;
  minutesComponent.disabled = lobbySettings.syncTimeWithServer;
  weatherComponent.disabled = lobbySettings.syncWeatherWithServer;
}

export default page;
