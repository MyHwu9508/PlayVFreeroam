import { Page } from '../../framework/Page';
import alt from 'alt-client';

const page = new Page('Invite Player');

page.onBeforeOpen(async () => {
  page.removeComponentsAfter(-1);
  await generateContent();
});

async function generateContent() {
  const lobbyPlayers = (await alt.emitRpc('getInvitePlayers')) as string[];
  if (!lobbyPlayers || lobbyPlayers.length === 0) return;

  for (const player of lobbyPlayers) {
    page.addConfirm(player[1], 'Are you sure you want to invite this player?').onInput(() => {
      alt.emitServerRaw('invitePlayerToLobby', player[0]);
    });
  }
}
export default page;
