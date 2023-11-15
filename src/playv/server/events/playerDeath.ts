import alt from 'alt-server';
import { customLobby } from '../systems/lobby/customLobbys';
import { KillFeedEntry } from '../../shared/types/types';
import { weaponData } from '../../shared/data/weapons';

alt.on('playerDeath', playerDeath);
alt.onClient('requestRespawn', requestRespawn);

function playerDeath(player: alt.Player, killer: alt.Player, weaponHash: number) {
  if (player.getLocalMeta('isDead')) {
    alt.logDebug('Player is already dead??');
    return;
  }
  player.setLocalMeta('isDead', true);
  player.emitRaw('playerDied');
  alt.logDebug('Player Died :(');

  announceKillFeed(killer, player, weaponHash);

  if (killer?.valid && killer.type === 0) {
    if (
      !killer.vehicle && //killer is not in a vehicle //todo is just a workaround for now
      weaponData[weaponHash] && //weapon exists
      weaponHash != 2725352035 && //weapon is not a melee weapon
      killer.getLocalMeta('dimension') === player.getLocalMeta('dimension') && //killer is in the same lobby
      !customLobby.getWeapons(player.getLocalMeta('dimension')).includes(weaponHash) //weapon is not allowed in this lobby
    ) {
      killer.customKick('You are not allowed to use this weapon in this lobby: ' + weaponHash);
      return;
    }

    //0 = player
    if (killer.getLobbySetting('healAfterKill')) {
      killer.health = killer.getLobbySetting('respawnHealth') + 100;
      killer.armour = killer.getLobbySetting('respawnArmour');
    }
    killer.emitRaw('showKillMessage', 'killed', player.getStreamSyncedMeta('username'));
  }
}

function requestRespawn(player: alt.Player, pos: alt.Vector3, rot: alt.Vector3) {
  alt.logDebug('request respawn ' + player.id);
  player.spawn(pos.x, pos.y, pos.z, 0);
  player.rot = rot;
  player.health = player.getLocalMeta('lobbySettings').respawnHealth + 100;
  player.armour = player.getLocalMeta('lobbySettings').respawnArmour;
  player.emitRaw('applyLobbyFlags');
  player.deleteLocalMeta('isDead');
  if (player.hasMeta('latestWeapon') && customLobby.getWeapons(player.dimension).includes(player.getMeta('latestWeapon') as number)) {
    player.emitRaw('handleWeaponForRespawn', player.getMeta('latestWeapon') as number);
  }

  player.invincible = player.getStreamSyncedMeta('inPassiveMode');
  player.clearBloodDamage();

  if (player.getLobbySetting('spawnProtection') > 0) {
    player.invincible = true;
    player.setStreamSyncedMeta('spawnProtection', true);
    alt.setTimeout(() => {
      if (!player?.valid) return;
      player.invincible = player.getStreamSyncedMeta('inPassiveMode') || player.getLocalMeta('isInSpawnProtectArea');
      player.deleteStreamSyncedMeta('spawnProtection');
    }, player.getLobbySetting('spawnProtection'));
  }
}

function announceKillFeed(killer: alt.Entity, victim: alt.Player, weaponHash: number) {
  if (!victim || !victim.valid || !victim.userData) return;
  const lobbyPlayers = customLobby.getPlayers(victim.getLocalMeta('dimension'));
  const killfeedmsg: KillFeedEntry = {
    killerName: killer?.getStreamSyncedMeta('username') ?? 'Unknown',
    victimName: victim?.getStreamSyncedMeta('username') ?? 'Unknown',
    imageName: weaponData[weaponHash]?.HashKey?.toLocaleLowerCase() ?? weaponHash.toString(),
  };

  if (!killer) {
    switch (weaponHash) {
      case 3452007600: //Fall
        killfeedmsg.killerName = 'Gravity';
        killfeedmsg.imageName = 'causeOfDeath_fall';
        break;

      default:
        killfeedmsg.killerName = killfeedmsg.victimName;
        break;
    }
  }

  if (killer?.type === 2) {
    //Ped
    killfeedmsg.killerName = 'NPC';
  } else if (killer?.type === 1) {
    //Vehicle
    killfeedmsg.killerName = 'Vehicle';
  }

  switch (weaponHash) {
    case 3750660587: //FIRE
      killfeedmsg.imageName = 'weapon_molotov';
      break;

    case 2741846334: //Vehicle
    case 133987706: //Vehicle
      killfeedmsg.imageName = 'causeOfDeath_vehicle';
  }
  alt.emitClientUnreliable(lobbyPlayers, 'pushKillfeed', killfeedmsg);
}
