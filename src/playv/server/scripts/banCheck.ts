/* eslint-disable import/exports-last */
import * as alt from 'alt-server';
import { AppDataSource } from '../systems/db/TypeORM';

export function checkPlayerForBans(player: alt.Player) {
  const reason = getPlayerBannedContext(player);
  if (reason) {
    return `You have been banned from this server until ${player.userData.isBannedUntil.toUTCString()}. To appeal the ban, kindly visit our Discord server: playv.mp/discord. Your ban reason: ${reason}`;
  }

  if (player.userData.discordID) {
    if (isPlayersDiscordIDAlreadyOnServer(player.userData.discordID)) {
      return 'Someone else is logged in with this Discord Account! Please do not share Discord Accounts!';
    }
  }

  if (isPlayersCloudIDAlreadyOnServer(player.userData.cloudID)) {
    return 'Someone else is logged in with this Cloud ID! Please do not share R* Accounts!';
  }
  return false;
}

function isPlayersDiscordIDAlreadyOnServer(discordID: string) {
  const doublePlayer = alt.Player.all.filter(x => x?.valid && x.userData?.discordID === discordID);
  if (doublePlayer.length > 1) {
    return true;
  }
  return false;
}

function isPlayersCloudIDAlreadyOnServer(cloudID: string) {
  if (!alt.hasBenefit(1)) return false;
  const doublePlayer = alt.Player.all.filter(x => x?.valid && x.cloudID === cloudID);
  if (doublePlayer.length > 1) {
    return true;
  }
  return false;
}

function getPlayerBannedContext(player: alt.Player) {
  //if is banned kick
  if (player.userData.isBannedUntil && player.userData.isBannedUntil > new Date()) {
    return player.userData.banReason;
    //if has still banned context
  } else if (player.userData.isBannedUntil || player.userData.banReason) {
    player.userData.isBannedUntil = null;
    player.userData.banReason = null;
    player.pushToast('success', 'Your ban expired, please follow the rules and have a nice stay!');
    AppDataSource.manager.save(player.userData);
  }
  return false;
}
