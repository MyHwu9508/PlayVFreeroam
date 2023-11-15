/* eslint-disable import/exports-last */
import alt from 'alt-server';
import { PUser } from '../entities/puser';
import { doesStringContainBadWord, levenshteinDistance } from '../utils/badWords';
import { ConVar } from '../../shared/conf/ConVars';
import { AppDataSource } from '../systems/db/TypeORM';

alt.onClient('requestUsernameWindow', requestUsernameWindow);

export async function requestUsernameWindow(player: alt.Player) {
  const oldUsername = player.userData.username;
  alt.logDebug('requested Username Window');
  if (!alt.debug && player.userData.lastUsernameChange && player.userData.lastUsernameChange.getTime() + 7 * 24 * 60 * 1000 > Date.now()) {
    player.pushToast('warning', 'You can only change your username once a week!');
    return false;
  }

  player.emitRaw('setUsernameWindowOpen', true);
  return new Promise(resolve => {
    alt.onClient(`reqSetUsername${player.id}`, reqSetUsername);

    async function reqSetUsername(player: alt.Player, name: string) {
      if (!player.canPerformAction('ReqUsername', 3000)) return;
      if (name.trim().length === 0) {
        player.pushToast('warning', 'Please enter a username!');
        return;
      }
      if (name.length < ConVar.USERNAME.MIN_LENGTH) {
        player.pushToast('warning', 'Your username is too short!');
        return;
      }
      if (name.length > ConVar.USERNAME.MAX_LENGTH) {
        player.pushToast('warning', 'Your username is too long!');
        return;
      }
      if (!new RegExp(/^[a-zA-Z0-9_ !?&()#+-]*$/).test(name) || name === 'pending') {
        player.pushToast('warning', 'Your username contains invalid characters!');
        return;
      }
      // not more then 2 spaces
      if (hasMoreThanTwoSpaces(name)) {
        player.pushToast('warning', 'Your username contains invalid characters!');
        return;
      }
      const isBadWordy = doesStringContainBadWord(name);
      if (isBadWordy) {
        player.pushToast('warning', 'Your username contains bad words!');
        player.addLog('Other', `Tried to set bad username containing: ${JSON.stringify(isBadWordy)}`, 'yellow');
        return;
      }

      for (const username of ConVar.USERNAME.BLOCKED_USERNAMES) {
        if (name.toLowerCase().indexOf(username) !== -1) {
          player.pushToast('warning', 'Your username contains bad words!');
          player.addLog('Other', `Tried to set bad username containing (Regex): ${username}`, 'yellow');
          return;
        }

        const leviDist = levenshteinDistance(name, username);
        if (leviDist <= ConVar.USERNAME.USERNAME_LEVINSTEIN_THRESHOLD) {
          player.pushToast('warning', 'Your username contains bad words!');
          player.addLog('Other', `Tried to set bad username containing: ${name} (LevinStein Function,dist:${leviDist}))`, 'yellow');
          return;
        }
      }

      const user = await AppDataSource.manager.findOne(PUser, { where: { username: name } });
      if (user) {
        player.pushToast('warning', 'This username is already taken!');
        return;
      }

      player.pushToast('success', 'Your username has been changed!');
      alt.offClient(`reqSetUsername${player.id}`, reqSetUsername);
      player.emitRaw('setUsernameWindowOpen', false);

      player.userData.lastUsernames.push(oldUsername);
      player.userData.lastUsernameChange = new Date();

      player.setStreamSyncedMeta('username', name);
      player.userData.username = name;
      player.saveToDB();

      resolve(true);
    }
  });
}

const hasMoreThanTwoSpaces = (input: string): boolean => input.split(' ').length > 3;
