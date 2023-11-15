import alt from 'alt-server';

// broken atm ??
alt.on('vehicleHorn', (vehicle: alt.Vehicle, player: alt.Player, state: boolean) => {
  alt.logDebug('vehicleHorn', vehicle.id, player.id, state);
  if (!state) return true; //aus machen geht immer;
  if (!player?.valid || !vehicle?.valid) return true;
  //cancel honk in spawn
  if (player.dimension !== 0) return true;
  return !player.getLocalMeta('isInSpawnProtectArea');
});
