import alt from 'alt-server';

alt.onClient('stopAnyAnimation', stopAnyAnimation);
alt.onClient('playAnimation', playAnimation);

function stopAnyAnimation(player: alt.Player) {
  player.clearTasks();
}

export function playAnimation(
  player: alt.Player,
  animDict: string,
  animName: string,
  flag = 33,
  playbackRate = 0,
  duration = -1,
  lockX = false,
  lockY = false,
  lockZ = false,
  blendInSpeed = 8,
  blendOutSpeed = 8
) {
  if (player.vehicle) {
    return player.pushToast('error', 'Not allowed while sitting in a vehicle!');
  }
  player.playAnimation(animDict, animName, blendInSpeed, blendOutSpeed, duration, flag, playbackRate, lockX, lockY, lockZ);
}
