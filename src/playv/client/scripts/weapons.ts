import alt from 'alt-client';
import native from 'natives';

alt.onServer('handleWeaponForRespawn', handleWeaponForRespawn);

function handleWeaponForRespawn(weaponHash: number) {
  native.giveWeaponToPed(alt.Player.local.scriptID, weaponHash, 9999, false, true);
  native.setAmmoInClip(localPlayer, weaponHash, native.getMaxAmmoInClip(localPlayer, weaponHash, true));
}
