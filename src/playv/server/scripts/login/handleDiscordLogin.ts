import alt from 'alt-server';
import { AppDataSource } from '../../systems/db/TypeORM';
import { PUser } from '../../entities/puser';
import { startLoginFlow } from './loginFlow';
import { discordBotSocket } from '../../systems/webServer/sockets';
import { deletePlayerBlip } from '../blips';
import { VehicleData } from '../../entities/vehicleData';
import { CharacterData } from '../../entities/characterData';
import { OutfitData } from '../../entities/outfitData';
import { LobbyPreset } from '../../entities/lobbyPreset';

export async function handleDiscordLogin(player: alt.Player, discordID: string) {
  alt.logDebug('Discord Auth Success for ' + player.cloudID || player.hwidHash);
  alt.logDebug('Discord Auth Success for DiscordID: ' + player.userData.discordID);
  const discordDBUsers = await getDBUUserWithDiscordID(discordID);
  if (discordDBUsers.length > 1) {
    alt.logError('Multiple DBUUsers with DiscordID? lol: ' + discordID);
    return false;
  }

  //backup user
  if (discordDBUsers.length === 0) {
    const res = tryBackupUser(player, discordID);
    if (typeof res === 'string') return alt.logError('Backup user failed with DiscordID: ' + discordID);
    return true;
  }
  if (!player?.valid || !player.userData) return 'Player left server?';
  //Migrate User from discordID
  if (discordDBUsers.length !== 1) {
    return alt.logError('general error trying to migrate?: ' + discordID);
  }

  deletePlayerBlip(player); //new one will be created in loginFlow
  player.deleteStreamSyncedMeta('username');
  player.deleteLocalMeta('isLoggedIn');
  player.deleteMeta('isLoggingIn');
  player.deleteMeta('firstTimeLogin');
  if (player.getMeta('playtimeInterval')) {
    alt.clearInterval(player.getMeta('playtimeInterval'));
    player.deleteMeta('playtimeInterval');
  }
  //CLear blip and more stuff idk yet

  await AppDataSource.getRepository(VehicleData).delete({ owner: { userID: player.userData.userID } });
  await AppDataSource.getRepository(CharacterData).delete({ userID: player.userData.userID });
  await AppDataSource.getRepository(OutfitData).delete({ userID: player.userData.userID });
  await AppDataSource.getRepository(LobbyPreset).delete({ ownerID: player.userData.userID });

  await AppDataSource.manager.remove(PUser, player.userData);
  player.userData = null;
  //   await AppDataSource.manager.update(PUser, { discordID: discordID }, { cloudID: player.cloudID });
  await AppDataSource.manager.findOneBy(PUser, { discordID: discordID }).then(async user => {
    user.cloudID = player.cloudID;
    await AppDataSource.manager.save(user);
  });
  player.emitRaw('setDiscordButtonVisible', false);
  player.pushToast('success', 'We found your old account and migrated it to your Discord Account!');
  discordBotSocket.emit('player:altRole', discordID);
  startLoginFlow(player);
  return true;
}

async function getDBUUserWithDiscordID(discord: string) {
  const dbuUser = await AppDataSource.manager.findBy(PUser, { discordID: discord });
  if (!dbuUser) {
    alt.logError(`Error fetching DBUUser with DiscordID: ${discord}`);
    return null;
  }
  return dbuUser;
}

async function tryBackupUser(player: alt.Player, discord: string) {
  const dbuUser = await AppDataSource.manager.findBy(PUser, { cloudID: player.cloudID });
  if (dbuUser.length > 1) {
    return 'More then one user with cloudID, abort backup' + player.cloudID;
  }
  if (dbuUser.length === 0) {
    if (!player?.valid || !player.userData) return 'Player left server?';
    player.userData.discordID = discord;
    player.saveToDB();
    player.pushToast('success', 'You synced your Discord Account and we have created a backup for you!');
    player.emitRaw('setDiscordButtonVisible', false);
  }
  return 'GENERAL ERROR BACKUP USER!!!!';
}
