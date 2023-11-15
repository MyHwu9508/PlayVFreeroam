import alt from 'alt-client';
import { Page } from '../../framework/Page';
import { AdminListData } from '../../../../../shared/types/types';
import { generatePageContent } from './Manage';
import { menuState } from '../../framework/State';
import { getRankDisplayLongName } from '../../../../../shared/conf/Ranks';

const page = new Page('Spieler');

page.onBeforeOpen(async () => {
  page.removeComponentsAfter(-1);
  let data: AdminListData[] = (await alt.emitRpc('A_GetPlayerList')) as AdminListData[];
  logDebug(data);
  data = data.sort((a, b) => a.position.distanceTo(localPlayer.pos) - b.position.distanceTo(localPlayer.pos));
  for (const player of data) {
    page
      .addButton(player.name)
      .onInput(() => {
        generatePageContent(player);
        menuState.setPath('/admin/players/manage');
      })
      .addContext(getPlayerContext(player));
  }
});
export default page;

function getPlayerContext(data: AdminListData) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">Name</span> ${data.name}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Berechtigung</span> ${getRankDisplayLongName(data.authlevel)}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Dimension</span> ${data.dimension}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Gemuted</span> ${data.isMuted}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Spielzeit</span> ${Math.ceil(data.playtime / 60)}h<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Distanz</span> ${data.position.distanceTo(localPlayer.pos).toFixed(2)}m<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Aktive Fahrzeuge</span> ${data.spawnedVehicles}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Warns</span> ${data.warns}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">UserID</span> ${data.userID}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">GameID</span> ${data.gameID}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Ping</span> ${data.ping}ms<br>`;
  context += '</div>';
  return context;
}
