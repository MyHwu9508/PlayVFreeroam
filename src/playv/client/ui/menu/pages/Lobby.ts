import alt from 'alt-client';
import { Page } from '../framework/Page';
import { Lobby } from '../../../../shared/types/lobby';
import _ from 'lodash';
import { permissions } from '../../../systems/access/permissions';
import { pushToast } from '../../hud/toasts';

const page = new Page('Lobby');

const createLobby = page.addLink('Create Lobby', '/lobby/create');
const manageLobby = page.addLink('Manage Lobby', '/lobby/manage');
let lobbyData: Lobby[] = [];
page.onBeforeOpen(async () => {
  await refreshPage();
});

async function refreshPage() {
  page.removeComponentsAfter(1);
  await generateLobbys();
  for (const lobby of lobbyData) {
    const lobbyComponent = page
      .addButton(lobby.name)
      .addConfig({
        trailing: String(lobby.players),
      })
      .addContext(generateLobbyctx(lobby))
      .onInput(async () => {
        if (permissions.getStateActive('noclip')) return pushToast('warning', 'You cannot join a lobby while in noclip');
        if (permissions.getStateActive('freecam')) return pushToast('warning', 'You cannot join a lobby while in freecam');
        const res = await alt.emitRpc('requestJoinLobby', lobby.dimension);
        if (res) {
          generateLobbys.cancel();
          refreshPage();
        }
      });
    if (!lobby.public && localPlayer.getStreamSyncedMeta('authlevel') > 0 && lobby.dimension !== alt.getLocalMeta('customLobbyOwner')) {
      lobbyComponent.addConfig({ color: 'error' });
    }
  }
  manageLobby.disabled = !(alt.getLocalMeta('customLobbyOwner') !== undefined);
  createLobby.disabled = alt.getLocalMeta('customLobbyOwner') !== undefined;
}

const generateLobbys = _.throttle(async () => {
  const newData = (await alt.emitRpc('getLobbyData')) as Lobby[];
  if (!lobbyData) return;
  lobbyData = newData.sort((a, b) => Number(b.players) - Number(a.players));
}, 5000);

function generateLobbyctx(lobby: Lobby) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">Name</span> ${lobby.name}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Description</span> ${lobby.description}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Owner</span> ${lobby.owner}<br>`;
  // context += `<span style="color:rgb(var(--color-primary-300));">Players</span> ${lobby.players}<br>`; //TODO duplicate > habs auskommentiert erstmal
  context += `<span style="color:rgb(var(--color-primary-300));">Headshot On</span> ${lobby.settings.headshot}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Weapon Damage</span> ${lobby.settings.weaponDmgMult}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Passive Mode</span> ${lobby.settings.passiveMode}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Heal After Kill</span> ${lobby.settings.healAfterKill}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Nametag Dist.</span> ${lobby.settings.nametagDrawDistance}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Respawn</span> ${getRespawnCtx(lobby)}<br>`;
  // context += `<span style="color:rgb(var(--color-primary-300));">Respawn HP</span> ${lobby.settings.respawnHealth}<br>`;
  // context += `<span style="color:rgb(var(--color-primary-300));">Respawn Armor</span> ${lobby.settings.respawnArmour}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Allow Noclip</span> ${lobby.permissions.includes('noclip')}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Time</span> ${
    lobby.settings.syncTimeOption === 'Server' ? 'Sync with Server' : `${lobby.settings.timeHours}:${lobby.settings.timeMinutes}`
  }<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Weather</span> ${lobby.settings.syncWeatherOption === 'Server' ? 'Sync with Server' : lobby.settings.weather}<br>`;
  context += '</div>';
  return context;
}

function getRespawnCtx(lobby: Lobby) {
  return lobby.settings.respawnAt === 'Positions' ? 'FFA: ' + lobby.settings.respawnOption : lobby.settings.respawnAt;
}
export default page;
