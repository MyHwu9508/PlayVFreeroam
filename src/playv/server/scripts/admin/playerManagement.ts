import alt from 'alt-server';
import { PUser } from '../../entities/puser';
import { PlayerLog } from '../../entities/playerLog';
import { AppDataSource } from '../../systems/db/TypeORM';
import { adminActionLog } from './logs';

// TODO when Prototypes done

export function createAndSavePlayerLogManagementAction(executor: number | 'SYSTEM' | PUser, target: number | PUser, type: NoteType, text: string) {
  if (typeof executor === 'object') executor = executor.userID;
  if (typeof executor === 'string') executor = -1;
  if (typeof target === 'object') target = target.userID;
  const note = new PlayerLog();
  note.type = type;
  note.text = text;
  note.executor = executor;
  note.color = 'magentaBright';
  note.userID = target;
  AppDataSource.manager.insert(PlayerLog, note);
}

export function kickPlayer(executor: number | PUser, player: alt.Player, reason: string) {
  adminActionLog(executor, `Kicked {${player.userData.userID}|${player.userData.username}} for ${reason}`);
  createAndSavePlayerLogManagementAction(executor, player.userData, 'Kicked', reason);
  player.customKick(reason);
}

export async function warnPlayer(executor: number | PUser, player: number | alt.Player, reason: string) {
  let altPlayer: alt.Player;
  if (typeof player === 'number') {
    altPlayer = alt.Player.all.find(p => p && p.valid && p.userData.userID === player);
  } else {
    altPlayer = player;
  }
  //Player offline
  if (!altPlayer && typeof player === 'number') {
    const dbUser = await AppDataSource.manager.findOne(PUser, { where: { userID: player } });
    if (dbUser) {
      adminActionLog(executor, `Warned {${dbUser.userID}|${dbUser.username}} for ${reason}`);
      createAndSavePlayerLogManagementAction(executor, dbUser, 'Warned', reason);
      dbUser.warns++;
      if (dbUser.warns >= 3) {
        dbUser.warns = 0;
        banPlayer('SYSTEM', dbUser.userID, 1000 * 60 * 60 * 24 * 7, '3/3 warns');
      } else {
        AppDataSource.manager.save(dbUser);
      }
    }
  } else if (altPlayer.valid && altPlayer.userData) {
    adminActionLog(executor, `Warned {${altPlayer.userData.userID}|${altPlayer.userData.username}} for ${reason}`);
    createAndSavePlayerLogManagementAction(executor, altPlayer.userData, 'Warned', reason);
    altPlayer.pushToast(
      'error',
      `Warning: You have received a warning due to rule violations. Please take this as a reminder to follow the server rules. If further rule violations occur, please note that accumulating three warnings will result in a 7 day ban from the server. We value fair play and a positive environment for all players. Thank you for your understanding. ${++altPlayer
        .userData.warns}/3 ${reason} `
    );
    if (altPlayer.userData.warns >= 3) {
      altPlayer.userData.warns = 0;
      banPlayer('SYSTEM', altPlayer, 1000 * 60 * 60 * 24 * 7, '3/3 warns');
    } else {
      altPlayer.saveToDB();
    }
  }
}

export async function banPlayer(executor: number | PUser | 'SYSTEM', player: number | alt.Player, duration: number | 'PERMANENT', reason: string) {
  let altPlayer: alt.Player;
  if (typeof player === 'number') {
    altPlayer = alt.Player.all.find(p => p && p.valid && p.userData.userID === player);
  } else {
    altPlayer = player;
  }
  //Player offline
  if (!altPlayer && typeof player === 'number') {
    const dbUser = await AppDataSource.manager.findOne(PUser, { where: { userID: player } });
    if (dbUser) {
      createAndSavePlayerLogManagementAction(executor, dbUser, 'Banned', reason);
      dbUser.banReason = reason;
      dbUser.isBannedUntil = duration === 'PERMANENT' ? new Date('2042,1,1') : new Date(Date.now() + duration);
      adminActionLog(executor, `Banned {${dbUser.userID}|${dbUser.username}} for ${reason} until ${dbUser.isBannedUntil.toUTCString()}`);
      AppDataSource.manager.save(dbUser);
    } else {
      logError('default', 'Failed to ban player, player not found in DB! ' + Number(player));
    }
  } else if (altPlayer.valid && altPlayer.userData) {
    createAndSavePlayerLogManagementAction(executor, altPlayer.userData, 'Banned', reason);
    altPlayer.userData.banReason = reason;
    altPlayer.userData.isBannedUntil = duration === 'PERMANENT' ? new Date('2042,1,1') : new Date(Date.now() + duration);
    adminActionLog(executor, `Banned {${altPlayer.userData.userID}|${altPlayer.userData.username}} for ${reason} until ${altPlayer.userData.isBannedUntil.toUTCString()}`);
    altPlayer.saveToDB();
    altPlayer.customKick(
      `You have been banned from this server until ${altPlayer.userData.isBannedUntil.toUTCString()}. To appeal the ban, kindly visit our Discord server: playv.mp/discord. Your ban reason: ${reason}`
    );
  }
}

export async function unbanPlayer(executor: number | PUser, player: number, reason: string) {
  const dbUser = await AppDataSource.manager.findOne(PUser, { where: { userID: player } });
  if (dbUser) {
    adminActionLog(executor, `Unbanned {${dbUser.userID}|${dbUser.username}} for ${reason}`);
    createAndSavePlayerLogManagementAction(executor, dbUser, 'AdminAction', 'Unbanned: ' + reason);
    dbUser.isBannedUntil = null;
    AppDataSource.manager.save(dbUser);
  } else {
    logError('default', 'Failed to unban player, player not found in DB! ' + player);
  }
}

export async function setMutedPlayer(executor: number | PUser, player: number | alt.Player, isMuted: boolean, reason: string) {
  let altPlayer: alt.Player;
  if (typeof player === 'number') {
    altPlayer = alt.Player.all.find(p => p && p.valid && p.userData.userID === player);
  } else {
    altPlayer = player;
  }
  //Player offline
  if (!altPlayer && typeof player === 'number') {
    const dbUser = await AppDataSource.manager.findOne(PUser, { where: { userID: player } });
    if (dbUser) {
      adminActionLog(executor, `Set muted: ${isMuted} {${dbUser.userID}|${dbUser.username}} for ${reason}`);
      createAndSavePlayerLogManagementAction(executor, dbUser, 'AdminAction', 'Set muted: ' + isMuted + reason);
      dbUser.isMuted = isMuted;
      AppDataSource.manager.save(dbUser);
    } else {
      logError('default', 'Failed to mute player, player not found in DB! ' + player);
    }
  } else if (altPlayer.valid && altPlayer.userData) {
    adminActionLog(executor, `Set muted: ${isMuted} {${altPlayer.userData.userID}|${altPlayer.userData.username}} for ${reason}`);
    createAndSavePlayerLogManagementAction(executor, altPlayer.userData, 'AdminAction', 'Set muted: ' + isMuted + reason);
    altPlayer.userData.isMuted = isMuted;
    altPlayer.saveToDB();
    altPlayer.pushToast('information', isMuted ? 'You have been muted!' : 'You have been unmuted!');
  }
}
