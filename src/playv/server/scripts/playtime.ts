import alt from 'alt-server';

//TODO replace with one counter for all players, maybe better performance?
export function initPlayTimeCounter(player: alt.Player) {
  player.setLocalMeta('playtimeMinutes', player.userData.playtimeMinutes);
  const setUserTime = alt.setInterval(() => {
    if (!player?.valid) {
      alt.clearTimeout(setUserTime);
      return;
    }
    player.userData.playtimeMinutes += 1;
    player.setLocalMeta('playtimeMinutes', player.userData.playtimeMinutes);
  }, 60000);
  player.setMeta('playtimeInterval', setUserTime);
}
