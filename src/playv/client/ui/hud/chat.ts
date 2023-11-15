/* eslint-disable import/exports-last */
import * as alt from 'alt-client';
import { ChatMessage, ChatRanges } from '../../../shared/types/types';
import { keybindManager } from '../../systems/keybinds';
import { webView } from '../view/webView';
import { pushToast } from './toasts';
import { setFocus } from '../focus';
import { permissions } from '../../systems/access/permissions';

alt.onServer('pushChatMessage', pushChatMessage);

export async function initChat() {
  keybindManager.registerEvent(
    'keybind.openChat',
    () => {
      openChat();
    },
    'keyup' // keyup here because youll see eheh
  );
  webView.on('confirmChat', confirmChat);
  refreshChatRanges();
}

async function refreshChatRanges() {
  await alt.Utils.waitFor(() => localPlayer.getStreamSyncedMeta('authlevel') !== undefined, 999999999999);
  if ((localPlayer.getStreamSyncedMeta('authlevel') as number) === 0) return;
  webView.emit('chatRange:ADD', ['Team']);
}

function openChat() {
  if (!permissions.can('ui.chat')) return;
  permissions.setStateActive('uiActive', true);
  setFocus(true, false, true, false);
  keybindManager.isBlocked = true;
  webView.emit('toggleChat', true);
  alt.emitServer('setIsChattingMeta', true);
}

function confirmChat(message: string, range: ChatRanges) {
  permissions.setStateActive('uiActive', false);
  keybindManager.isBlocked = false;
  setFocus(false);
  webView.emit('toggleChat', false);
  alt.emitServer('setIsChattingMeta', false);
  if (!message) return;

  const text = message.trim();
  if (text.length === 0) return; // return on empty msg without notification
  if (text[0] === '/') return pushToast('warning', 'There are no chat commands on this server! Use M to open the main menu or press L for the Lobby selection!');

  alt.emitServerRaw('sendChatMessage', text, range);
}

export function pushChatMessage(message: ChatMessage) {
  webView.emit('pushChatMessage', message);
}
