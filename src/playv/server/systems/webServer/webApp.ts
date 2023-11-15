import express from 'express';
import cors from 'cors';
import * as alt from 'alt-server';
import { initSockets } from './sockets';
import { discordAuthRedirect } from '../../scripts/login/authServer';

const CONFIG = alt.getServerConfig()?.ports as PortsConfig;
if (!CONFIG || !CONFIG.adminpanelsocket || !CONFIG.discordauthport || !CONFIG.discordbotsocket) {
  throw new Error('Invalid Ports Config! Check webApp.ts');
}
//DISCORD AUTH
const discordAuth = express();
discordAuth.use(cors());
discordAuth.get(alt.getServerConfig().discordlogin.listenerPath, discordAuthRedirect);
discordAuth.listen(CONFIG.discordauthport);
alt.log('success', `[HTTP|Discord] Discord Auth Server listening on port ${CONFIG.discordauthport}`);

//SERVICES USED BY DISCORD BOT
initSockets();

export interface PortsConfig {
  discordauthport: number; //Web Login for sync
  discordbotsocket: number; //Socket for Discord Bot > Usercount
  adminpanelsocket: number; //Socket for Admin Panel
}
