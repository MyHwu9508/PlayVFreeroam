/* eslint-disable import/exports-last */
import { Server } from 'socket.io';
import alt from 'alt-server';
import type { PortsConfig } from './webApp';
import { getAuthLevelFromDiscordID } from './adminPanel/auth';
import {
  banPlayerFromAP,
  deleteAllPlayersVehiclesFromAP,
  getPlayerData,
  getPlayerListForAP,
  kickPlayerFromAP,
  setMutedFromAP,
  unbanPlayerFromAP,
  warnPlayerFromAP,
} from './adminPanel/players';
import { playerSearchFromAP } from './adminPanel/playerSearch';
import { getPlayerCount } from '../../utils/playercount';

const CONFIG = alt.getServerConfig()?.ports as PortsConfig;

export const discordBotSocket = new Server();
export const adminPanelSocket = new Server();

discordBotSocket.on('connection', socket => {
  alt.log('information', `[Socket|Discord Bot] Connection from ${socket.handshake.address}`);
  socket.on('disconnect', () => {
    alt.log('information', `[Socket|Discord Bot] Disconnected from ${socket.handshake.address}`);
  });
  socket.on('error', error => {
    alt.log('error', `[Socket|Discord Bot] Error from ${socket.handshake.address}: ${error}`);
  });
  socket.on('req:playerCount', (cb: (...args: unknown[]) => void) => {
    cb(getPlayerCount());
  });
});

adminPanelSocket.on('connection', socket => {
  alt.log('information', `[Socket|Admin Panel] Connection from ${socket.handshake.address}`);
  socket.on('disconnect', () => {
    alt.log('information', `[Socket|Admin Panel] Disconnected from ${socket.handshake.address}`);
  });
  socket.on('error', error => {
    alt.log('error', `[Socket|Admin Panel] Error from ${socket.handshake.address}: ${error}`);
  });
  socket.on('req:authLevel', getAuthLevelFromDiscordID);
  socket.on('req:playerList', getPlayerListForAP);
  socket.on('req:playerData', getPlayerData);
  socket.on('kickPlayer', kickPlayerFromAP);
  socket.on('warnPlayer', warnPlayerFromAP);
  socket.on('banPlayer', banPlayerFromAP);
  socket.on('unbanPlayer', unbanPlayerFromAP);
  socket.on('setMutedPlayer', setMutedFromAP);
  socket.on('delPlayerVeh', deleteAllPlayersVehiclesFromAP);
  socket.on('req:playerSearch', playerSearchFromAP);
});

export function initSockets() {
  discordBotSocket.listen(CONFIG.discordbotsocket);
  alt.log('success', `[Socket|Discord Bot] Socket listening on port ${CONFIG.discordbotsocket}`);
  adminPanelSocket.listen(CONFIG.adminpanelsocket);
  alt.log('success', `[Socket|Admin Panel] Socket listening on port ${CONFIG.adminpanelsocket}`);
}
