import alt from 'alt-server';
import { ChatMessage, ChatRanges } from '../../shared/types/types';
import { ConVar } from '../../shared/conf/ConVars';
import { doesStringContainBadWord } from '../utils/badWords';
import { getRankChatDisplayColor, getRankDisplayLongName, getRankDisplayName } from '../../shared/conf/Ranks';
import { ChatLog } from '../entities/chatLog';
import { AppDataSource } from '../systems/db/TypeORM';

alt.onClient('sendChatMessage', sendChatMessage);
alt.onClient('setIsChattingMeta', (player, state) => {
  player.setStreamSyncedMeta('isChatting', state);
});

//client sent a message to the server
function sendChatMessage(player: alt.Player, message: string, range: ChatRanges) {
  if (!player?.valid || player.userData === undefined) return;
  if (player.userData.isMuted) {
    return player.pushToast('warning', 'You are muted!');
  }

  if (range === 'Global' && alt.getSyncedMeta('isGlobalChatMuted')) {
    player.pushToast('warning', 'The global chat has been turned off! Please press TAB and select a different chat range!');
    return;
  }

  if (!range || !message) return;
  if (message.length > ConVar.CHAT.MAX_TEXT_LENGTH) {
    return player.pushToast('warning', 'The message you provided is too long!');
  }

  //check cooldown and bad words for all normal users, not team members
  if (player.userData.authlevel === 0) {
    if (!player.canPerformAction('chat', 3000)) return;
    const badwords = doesStringContainBadWord(message, true, ConVar.CHAT.LEVINSTEIN_THRESHOLD);
    if (badwords) {
      player.addLog('Other', 'blocked chat words: ' + badwords, 'black');
      return player.pushToast('warning', 'Your message contains bad words!');
    }
    message = message // replace potential bad symbols
      .replace(/</g, '&lt;')
      .replace(/'/g, '&#39')
      .replace(/"/g, '&#34');
  }

  const receipients = getMessageReceipients(player, range);
  if (receipients.length < 2) {
    player.pushToast('information', 'Your message has not reached anyone. You can adjust the range of your messages by pressing the TAB key!');
    if (!alt.debug) return;
  }

  //  fake authlevel
  let pAuthLevel = player.getStreamSyncedMeta('authlevel') as number;
  if (player.getStreamSyncedMeta('hideAdminStatus') === true) {
    pAuthLevel = 0;
  }
  let usernameColor = '#000000';
  let tag = '';
  let shortTag = '';

  //fetch team
  if (pAuthLevel > 0) {
    usernameColor = getRankChatDisplayColor(pAuthLevel);
    tag = getRankDisplayLongName(pAuthLevel);
    shortTag = getRankDisplayName(pAuthLevel);

    // allow messages with image urls and modify them to work
    if (message.endsWith('.gif') || message.endsWith('.png') || message.endsWith('.jpg')) {
      message = `<img src="${message}">`;
    }
  }

  const chatMessage: ChatMessage = {
    username: player.getStreamSyncedMeta('username') as string,
    range: range,
    longTag: tag,
    tag: shortTag,
    tagColor: usernameColor,
    text: message,
  };
  //add to log
  const log = new ChatLog();
  log.dimension = player.dimension;
  log.message = message;
  log.range = range;
  log.senderID = player.userData.userID;
  AppDataSource.manager.insert(ChatLog, log);
  alt.emitClientRaw(receipients, 'pushChatMessage', chatMessage);
}

//based on range get receiptient players for that chat message
function getMessageReceipients(player: alt.Player, range: string) {
  const receipients = [];
  const _allPlayers = alt.Player.all;

  switch (range) {
    case 'Near': // NEAR
      for (let i = 0; i < _allPlayers.length; i++) {
        if (_allPlayers[i] === undefined || !_allPlayers[i].valid) continue;
        if (player.pos.distanceTo(_allPlayers[i].pos) <= ConVar.CHAT.NEAR_CHAT_RANGE && _allPlayers[i].dimension === player.dimension) receipients.push(_allPlayers[i]);
      }
      break;
    case 'Lobby': // LOBBY / DIMENSION
      for (let i = 0; i < _allPlayers.length; i++) {
        if (_allPlayers[i] === undefined || !_allPlayers[i].valid) continue;
        if (_allPlayers[i].dimension === player.dimension) receipients.push(_allPlayers[i]);
      }
      break;
    case 'Global': // GLOBAL
      for (let i = 0; i < _allPlayers.length; i++) {
        if (_allPlayers[i] === undefined || !_allPlayers[i].valid) continue;
        receipients.push(_allPlayers[i]);
      }
      break;
    case 'Team': // TEAM
      for (let i = 0; i < _allPlayers.length; i++) {
        if (_allPlayers[i] === undefined || !_allPlayers[i].valid || _allPlayers[i].userData === undefined) continue;
        if (_allPlayers[i].userData.authlevel > 0) receipients.push(_allPlayers[i]);
      }
      break;
  }
  return receipients;
}
