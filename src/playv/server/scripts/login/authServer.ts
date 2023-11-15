import express from 'express';
import * as alt from 'alt-server';
import path from 'path';
import { ConVar } from '../../../shared/conf/ConVars';
import { DiscordUser } from './generateUser';
import { handleDiscordLogin } from './handleDiscordLogin';
const successHTML = path.join(alt.rootDir, './resources/playv/server/scripts/login/html/success.html');
const failHTML = path.join(alt.rootDir, './resources/playv/server/scripts/login/html/fail.html');

export async function discordAuthRedirect(req: express.Request, res: express.Response) {
  const playerUUID = String(req.query.state);
  const discordToken = String(req.query.code);

  if (!playerUUID || !discordToken) {
    res.sendFile(failHTML);
    return;
  }

  const authTokenRequest = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: ConVar.LOGIN.DISCORD_APP_ID,
      client_secret: alt.getServerConfig().discordlogin.clientsecret,
      grant_type: 'authorization_code',
      code: discordToken,
      redirect_uri: `${alt.getServerConfig().discordlogin.redirectURI}`,
      scope: 'identify',
    }),
  });

  if (!authTokenRequest.ok || authTokenRequest.status !== 200 || !authTokenRequest.body) {
    res.sendFile(failHTML);
    return;
  }

  const authToken = await authTokenRequest.json();
  alt.logDebug('INCOMMING Discord LOGIN REQ: ', discordToken, playerUUID);

  const player = alt.Player.all.find(p => p?.valid && p.getMeta('discordUUID') === playerUUID);
  if (!player) {
    alt.logError('Error finding player with UUID: ' + playerUUID);
    res.sendFile(failHTML);
    return;
  }

  const discordProfile = await fetchDiscordUser(authToken.access_token);
  if (!discordProfile) {
    alt.logError('Error fetching Discord Profile for ' + player.cloudID || player.hwidHash);
    res.sendFile(failHTML);
    return;
  }
  const resLogin = await handleDiscordLogin(player, discordProfile.id);
  res.sendFile(resLogin === true ? successHTML : failHTML);
}

async function fetchDiscordUser(token: string): Promise<DiscordUser | null> {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) return null;
  return await response.json();
}
