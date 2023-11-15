import alt from 'alt-client';
import { defaultLobbyPermissions, Lobby, LobbySettings, PassiveModeOptions, RespawnOptions } from '../../../../../shared/types/lobby';
import { menu, menuState } from '../../framework/State';
import { Page } from '../../framework/Page';
import Time from './TimeAndWeather';
import Weapons from './WeaponsAndPvP';
import VehicleAndTraffic from './VehicleAndTraffic';
import { ConVar } from '../../../../../shared/conf/ConVars';
import Kick from './Kick';
import Invite from './Invite';
import Misc from './Misc';

menu.addPage('/lobby/manage/time', Time);
menu.addPage('/lobby/manage/weapons', Weapons);
menu.addPage('/lobby/manage/vehicleandtraffic', VehicleAndTraffic);
menu.addPage('/lobby/manage/invite', Invite);
menu.addPage('/lobby/manage/kick', Kick);
menu.addPage('/lobby/manage/misc', Misc);

const page = new Page('Manage Lobby');

page.onBeforeOpen(async () => {
  page.removeComponentsAfter(-1);
  await generateContent();
});

async function generateContent() {
  const lobby = (await alt.emitRpc('getOwnLobbyData')) as Lobby;
  const lobbySettings = lobby.settings;
  const lobbyPermissions = lobby.permissions;

  logDebug(JSON.stringify(lobby));

  page
    .addToggle('Public', lobby.public)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyConfig', 'public', comp.value);
    })
    .addContext('This will make your lobby public so other players can join. If turned off you need to invite players, otherwise only you can join this lobby!')
    .addThrottle(1000);

  page
    .addInput('Name', lobby.name, ConVar.LOBBY.MAX_NAME_LENGTH)
    .onFinished(async (comp, confirmed) => {
      if (!confirmed) return;
      const res = await alt.emitRpc('setLobbyConfig', 'name', comp.value);
    })
    .addThrottle(1000);

  page
    .addInput('Description', lobby.description, ConVar.LOBBY.MAX_DESCRIPTION_LENGTH)
    .onFinished(async (comp, confirmed) => {
      if (!confirmed) return;
      const res = await alt.emitRpc('setLobbyConfig', 'description', comp.value);
    })
    .addThrottle(1000);

  page.addLink('Invite Player', '/lobby/manage/invite').addContext('Invite players to your lobby.');
  page.addLink('Kick Player', '/lobby/manage/kick').addContext('Kick players from your lobby.');

  page
    .addConfirm('Close', 'Are you sure you want to close your lobby?')
    .onInput(async () => {
      const res = await alt.emitRpc('closeOwnLobby');
      menuState.setPath('/');
    })
    .addContext('This will delete the lobby and all players will be kicked to the freeroam lobby!');

  page
    .addConfirm('Save as Preset', 'Are you sure you want to save this lobby as a preset?')
    .onInput(async () => {
      alt.emitServerRaw('saveCurrentLobbyAsPreset');
    })
    .addContext('This will save your current lobby as a preset. You can then load it in the future.')
    .addThrottle(200);

  page.addButton('').addConfig({ line: true, lineColor: 'primary' });

  page.addLink('Time & Weather', '/lobby/manage/time').addContext('Manage the time for the lobby.');
  page.addLink('Weapons & PvP', '/lobby/manage/weapons').addContext('Manage the weapons for the lobby.');
  page.addLink('Vehicle & Traffic', '/lobby/manage/vehicleandtraffic').addContext('Manage the vehicles and traffic for the lobby.');
  page.addLink('Misc', '/lobby/manage/misc').addContext('Manage other settings for the lobby. (eg. player markers, superjump, running speed, noclip etc.)');
}

export default page;
