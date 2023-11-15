import alt from 'alt-server';

export function getPlayerCount() {
  let playerCount = 0;
  const players = alt.Player.all;

  for (const player of players) {
    if (player && player.valid && player.getLocalMeta('isLoggedIn')) {
      playerCount++;
    }
  }
  return playerCount;
}
