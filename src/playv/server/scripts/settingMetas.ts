import alt from 'alt-server';

alt.onClient('setNoclipState', (player, vehicleID, state) => {
  if (vehicleID) {
    alt.Vehicle.getByID(vehicleID)?.setStreamSyncedMeta('isInNoClip', state);
  } else {
    player.setStreamSyncedMeta('isInNoClip', state);
  }
});
