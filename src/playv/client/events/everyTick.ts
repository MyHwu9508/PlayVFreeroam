import alt from 'alt-client';
import { cayoTick } from '../scripts/world/cayoPerico';
import { hideAllHudComponentsThisFrame } from '../ui/gta/misc';
import { nitroTick } from '../scripts/nitro';
import { freecamTick } from '../scripts/freecam';
import { noclipTick } from '../scripts/noclip';
import native from 'natives';
import { getLobbySetting } from '../systems/lobby';
import { nametagTick } from '../scripts/nametags';
import { spawnAreaProtectionTick } from '../scripts/spawnarea/protection';
import { hitmarkers } from '../scripts/hitmarker';
import { LocalStorage } from '../systems/localStorage';
import { utils } from '../../shared/utils';
import { permissions } from '../systems/access/permissions';

alt.everyTick(() => {
  cayoTick();
  nitroTick();
  freecamTick();
  noclipTick();
  nametagTick();
  spawnAreaProtectionTick();
  hitmarkers.tick();

  log2D.draw();

  //Trydisable instant kill with motorcycles
  native.disableControlAction(0, 345, true);
  native.disableControlAction(0, 346, true);
  native.disableControlAction(0, 347, true);

  if (!(alt.getMeta('showHud') ?? true)) {
    hideAllHudComponentsThisFrame();
  }

  if (localPlayer.getStreamSyncedMeta('inPassiveMode') || alt.getLocalMeta('isInSpawnProtectArea') || localPlayer.getStreamSyncedMeta('spawnProtection')) {
    native.setWeaponDamageModifier(-1553120962, 0); //vdm ran over
    native.setWeaponDamageModifier(133987706, 0); //vdm rammed
    native.setWeaponDamageModifier(539292904, 0); //explosion
    localPlayer.blockPVPKeys();
  }

  if (permissions.getStateActive('healing')) {
    localPlayer.blockPVPKeys();
  }

  // https://forum.cfx.re/t/disable-player-attacking-stance/2039138
  if (native.isPedUsingActionMode(localPlayer)) {
    native.setPedUsingActionMode(localPlayer, false, -1, 'DEFAULT_ACTION');
  }

  native.setPedSuffersCriticalHits(localPlayer, getLobbySetting('headshot'));
  native.setPlayerWeaponDamageModifier(localPlayer, getLobbySetting('weaponDmgMult'));
  if (getLobbySetting('superjump')) native.setSuperJumpThisFrame(localPlayer);

  if (!LocalStorage.get('uiShowHudInformation')) {
    native.hideHudComponentThisFrame(6); //vehName
    native.hideHudComponentThisFrame(7); //areaName
    native.hideHudComponentThisFrame(8); //vehicleClass
    native.hideHudComponentThisFrame(9); //streetName
    native.hideHudComponentThisFrame(20); //weapon stats in weapon wheel
  }

  if (!getLobbySetting('meleeCriticalHits')) {
    for (const player of alt.Player.streamedIn) {
      native.setPedResetFlag(player, 187, true);
    }
  }
});
