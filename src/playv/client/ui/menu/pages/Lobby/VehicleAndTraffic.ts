import { Page } from '../../framework/Page';
import alt from 'alt-client';
import { menu } from '../../framework/State';
import { Toggle } from '../../framework/components/Toggle';
import { spawnPositions } from '../../../../../shared/data/spawnPositions';
import { NumberSelect } from '../../framework/components/NumberSelect';
import { LobbySettings } from '../../../../../shared/types/lobby';

const page = new Page('Vehicle & Traffic');
let lobbySettings: LobbySettings;
let lobbyPermissions: string[];
let respawnOptionComponent: NumberSelect;

page.onBeforeOpen(async () => {
  page.removeComponentsAfter(-1);
  await generateContent();
});

async function generateContent() {
  lobbySettings = (await alt.emitRpc('getLobbySettings')) as LobbySettings;
  lobbyPermissions = (await alt.emitRpc('getLobbyPermissions')) as string[];

  page
    .addToggle('Allow Vehicle Spawning', lobbyPermissions.includes('vehicle.spawn'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'vehicle.spawn', comp.value);
    })
    .addThrottle(200);

  page
    .addToggle('Allow Vehicle Nitro', lobbyPermissions.includes('vehicle.nitro'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'vehicle.nitro', comp.value);
    })
    .addContext('This will enable/disable the ability to use nitro in vehicles.')
    .addThrottle(200);

  page
    .addToggle('Allow Vehicle Handling', lobbyPermissions.includes('vehicle.handling'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'vehicle.handling', comp.value);
    })
    .addContext('This will enable/disable the ability to modify handling for vehicles.')
    .addThrottle(200);

  page
    .addToggle('Allow Vehicle Tuning', lobbyPermissions.includes('vehicle.tuning'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'vehicle.tuning', comp.value);
    })
    .addContext('This will enable/disable the ability to modify tuning for vehicles.')
    .addThrottle(200);

  page
    .addToggle('Vehicle Slipstream', lobbySettings.vehicleSlipStreaming)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'vehicleSlipStreaming', comp.value);
    })
    .addContext('This will enable/disable slipstream for vehicles.')
    .addThrottle(200);

  page
    .addToggle('Vehicle Godmode', lobbyPermissions.includes('vehicle.godmode'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'vehicle.godmode', comp.value);
    })
    .addContext('This will enable/disable godmode on vehicles.')
    .addThrottle(200);

  page
    .addToggle('Can Fly Thru Windscreen', lobbySettings.canFlyThruWindscreen)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'canFlyThruWindscreen', comp.value);
    })
    .addContext('This will enable/disable the ability to fly through the windscreen when crashing into something.')
    .addThrottle(200);

  page.addButton('').addConfig({ line: true, lineColor: 'primary' });

  page
    .addToggle('Traffic Enabled', lobbySettings.traffic_enabled)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'traffic_enabled', comp.value);
    })
    .addContext('This will enable/disable traffic in the lobby.')
    .addThrottle(200);

  page
    .addNumberSelect('Traffic Density', 20, 200, 5, lobbySettings.traffic_density)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'traffic_density', Number(comp.value));
    })
    .addContext(
      'Lower value = more density. We use this value to calculate the space between vehicles when creating them. This heavily affects the population of vehicles in the lobby.'
    )
    .addThrottle(500);

  updatePageContents(false);
}

async function updatePageContents(updateData = true) {
  if (!lobbySettings) return;
  if (updateData) {
    lobbySettings = (await alt.emitRpc('getLobbySettings')) as LobbySettings;
    lobbyPermissions = (await alt.emitRpc('getLobbyPermissions')) as string[];
  }
}
export default page;
