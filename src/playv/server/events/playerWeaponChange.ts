import alt from 'alt-server';
import { fillWeaponAmmo } from '../scripts/weapons';

alt.on('playerWeaponChange', (player, oldWeapon, newWeapon) => {
  player.setMeta('latestWeapon', newWeapon);
  fillWeaponAmmo(player, oldWeapon);
});
