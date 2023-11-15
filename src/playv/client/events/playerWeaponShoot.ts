import alt from 'alt-client';
import { getRandomInt } from '../../shared/utils/math/numbers';
import { checkCurrentWeapon } from '../systems/anticheat/checkWeaponStats';

alt.on('playerWeaponShoot', (weaponHash: number, totalAmmo: number, ammoInClip: number) => {
  if (getRandomInt(0, 100) > 95) {
    checkCurrentWeapon();
  }
});
