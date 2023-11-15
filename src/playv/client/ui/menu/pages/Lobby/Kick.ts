import { Page } from '../../framework/Page';
import alt from 'alt-client';

const page = new Page('Kick Player');

page.onBeforeOpen(async () => {
  page.removeComponentsAfter(-1);
  await generateContent();
});

async function generateContent() {
  const lobbyPlayers = (await alt.emitRpc('getLobbyPlayers')) as string[];
  if (!lobbyPlayers || lobbyPlayers.length === 0) return;

  for (const player of lobbyPlayers) {
    page.addConfirm(player[1], 'Are you sure you want to kick this player?').onInput(() => {
      alt.emitServerRaw('playerKickPlayerFromLobby', player[0]);
    });
  }
}
export default page;
