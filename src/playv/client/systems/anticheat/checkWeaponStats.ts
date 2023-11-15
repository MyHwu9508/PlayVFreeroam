import alt from 'alt-client';
import { ConVar } from '../../../shared/conf/ConVars';
import { defaultWeaponStats } from '../../../shared/data/weapons';

//check and apply default weaponstats
export function checkWeaponStats() {
  if (ConVar.ANTICHEAT.SKIP_DEFAULT_WEAPON_STATS_APPLY) {
    logDebug('SKIP CHECKING AND APPLYING DEFAULT WEAPON STATS!');
    alt.emitServerRaw('informServer', 'weaponStats', `Skipped checking and applying default weapon stats!`);
    return;
  }
  for (const [key, value] of Object.entries(defaultWeaponStats)) {
    let weaponStat: alt.WeaponData;
    try {
      weaponStat = alt.WeaponData.getForHash(Number(key));
    } catch (e) {
      alt.emitServerRaw('informServer', 'weaponStats', 'Player is missing weapon? ' + key + e);
    }
    if (!weaponStat) continue;

    if (weaponStat.clipSize != value.clipSize) {
      alt.emitServerRaw(
        'log1n',
        `modified clipsize default: ${weaponStat.clipSize}, user: ${value.clipSize} of weapon: ${key}. Please remove this weapon mod to play on our server, or adjust the clipsize!`
      );
    }
    if (weaponStat.range != value.range) {
      alt.emitServerRaw('informServer', 'weaponStats', `modified range default: ${weaponStat.range}, user: ${value.range} of weapon: ${key}.`);
    }
    if (weaponStat.accuracySpread != value.accuracySpread) {
      alt.emitServerRaw('informServer', 'weaponStats', `modified accuracySpread default: ${weaponStat.accuracySpread}, user: ${value.accuracySpread} of weapon: ${key}.`);
    }
    if (weaponStat.damage != value.damage) {
      alt.emitServerRaw('informServer', 'weaponStats', `modified damage default: ${weaponStat.damage}, user: ${value.damage} of weapon: ${key}.`);
    }
    if (weaponStat.recoilAccuracyMax != value.recoilAccuracyMax) {
      alt.emitServerRaw('informServer', 'weaponStats', `modified recoilAccuracyMax default: ${weaponStat.recoilAccuracyMax}, user: ${value.recoilAccuracyMax} of weapon: ${key}.`);
    }
    if (weaponStat.recoilShakeAmplitude != value.recoilShakeAmplitude) {
      alt.emitServerRaw(
        'informServer',
        'weaponStats',
        `modified recoilShakeAmplitude default: ${weaponStat.recoilShakeAmplitude}, user: ${value.recoilShakeAmplitude} of weapon: ${key}.`
      );
    }
    weaponStat.range = value.range;
    weaponStat.accuracySpread = value.accuracySpread;
    weaponStat.animReloadRate = value.animReloadRate;
    weaponStat.headshotDamageModifier = value.headshotDamageModifier;
    weaponStat.recoilAccuracyMax = value.recoilAccuracyMax;
    weaponStat.damage = value.damage;
    weaponStat.lockOnRange = value.lockOnRange;
    weaponStat.playerDamageModifier = value.playerDamageModifier;
    weaponStat.recoilShakeAmplitude = value.recoilShakeAmplitude;
    weaponStat.recoilAccuracyToAllowHeadshotPlayer = value.recoilAccuracyToAllowHeadshotPlayer;
    weaponStat.recoilRecoveryRate = value.recoilRecoveryRate;
  }
}

export function checkCurrentWeapon() {
  if (localPlayer.currentWeapon == 0xa2719263) return; //not fist
  let weaponStat: alt.WeaponData;
  try {
    weaponStat = alt.WeaponData.getForHash(localPlayer.currentWeapon);
  } catch (e) {
    alt.emitServerRaw('informServer', 'weaponStats', 'Player is missing weapon? ' + localPlayer.currentWeapon + e);
  }
  if (!weaponStat) return;
  const defaultStat = defaultWeaponStats[localPlayer.currentWeapon];

  if (weaponStat.range != defaultStat.range) {
    alt.emitServerRaw('informServer', 'weaponStats', `modified range default: ${defaultStat.range}, user: ${weaponStat.range} of weapon: ${localPlayer.currentWeapon}.`);
    alt.emitServerRaw('log1n', 'Come on bro, you are not even trying to hide it...');
  }
  if (weaponStat.accuracySpread != defaultStat.accuracySpread) {
    alt.emitServerRaw(
      'informServer',
      'weaponStats',
      `modified accuracySpread default: ${defaultStat.accuracySpread}, user: ${weaponStat.accuracySpread} of weapon: ${localPlayer.currentWeapon}.`
    );
    alt.emitServerRaw('log1n', 'Come on bro, you are not even trying to hide it...');
  }
  if (weaponStat.damage != defaultStat.damage) {
    alt.emitServerRaw('informServer', 'weaponStats', `modified damage default: ${defaultStat.damage}, user: ${weaponStat.damage} of weapon: ${localPlayer.currentWeapon}.`);
  }
  if (weaponStat.recoilAccuracyMax != defaultStat.recoilAccuracyMax) {
    alt.emitServerRaw(
      'informServer',
      'weaponStats',
      `modified recoilAccuracyMax default: ${defaultStat.recoilAccuracyMax}, user: ${weaponStat.recoilAccuracyMax} of weapon: ${localPlayer.currentWeapon}.`
    );
    alt.emitServerRaw('log1n', 'Come on bro, you are not even trying to hide it...');
  }
  if (weaponStat.recoilShakeAmplitude != defaultStat.recoilShakeAmplitude) {
    alt.emitServerRaw(
      'informServer',
      'weaponStats',
      `modified recoilShakeAmplitude default: ${defaultStat.recoilShakeAmplitude}, user: ${weaponStat.recoilShakeAmplitude} of weapon: ${localPlayer.currentWeapon}.`
    );
    alt.emitServerRaw('log1n', 'Come on bro, you are not even trying to hide it...');
  }
}
