import { Page } from '../../framework/Page';
import alt from 'alt-client';
import { LobbySettings } from '../../../../../shared/types/lobby';
import native from 'natives';

const page = new Page('Misc');
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
    .addToggle('Player Markers', lobbySettings.blips)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'blips', comp.value);
    })
    .addContext('This will enable/disable blips on the map for players and vehicles.');
  page
    .addNumberSelect('Running Speed', 1, 1.49, 0.01, lobbySettings.runningSpeed)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'runningSpeed', Number(comp.value));
    })
    .addThrottle(200);

  page
    .addNumberSelect('Nametag Draw Distance', 0, 500, 10, lobbySettings.nametagDrawDistance)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'nametagDrawDistance', Number(comp.value));
    })
    .addContext('This is the distance in meters that you can see nametags. 0 meters means drawing nametags is off.')
    .addThrottle(200);

  page
    .addToggle('Superjump', lobbySettings.superjump)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'superjump', comp.value);
    })
    .addContext('This will enable/disable the ability to superjump.');

  page
    .addToggle('Allow Freecam', lobbyPermissions.includes('freecam'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'freecam', comp.value);
    })
    .addContext('This will enable/disable the ability to use freecam.');

  page
    .addToggle('Allow Noclip', lobbyPermissions.includes('noclip'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'noclip', comp.value);
    })
    .addContext('This will enable/disable the ability to use noclip.');

  page
    .addToggle('Allow Parachute', lobbyPermissions.includes('parachute.use'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'parachute.use', comp.value);
    })
    .addContext('This will enable/disable the ability to use a parachute with the keybind.');
}
export default page;
