import alt from 'alt-server';
import { onPromiseClient } from '../../utils/promiseEvents';
import { ConVar } from '../../../shared/conf/ConVars';
import { UUID } from 'uuidjs';

alt.onRpc('getDiscordAuthUrl', getDiscordAuthUrl);

const redirectURI = encodeURI(`${alt.getServerConfig().discordlogin.redirectURI}`);
const loginURL = `https://discord.com/api/oauth2/authorize?scope=identify&response_type=code&client_id=${ConVar.LOGIN.DISCORD_APP_ID}&redirect_uri=${redirectURI}`;

// build user-based login url
function generateDiscordLoginURL(player: alt.Player) {
  if (!player.hasMeta('discordUUID')) {
    const playerUUID = UUID.genV4().toString();
    player.setMeta('discordUUID', playerUUID);
  }
  return `${loginURL}&state=${player.getMeta('discordUUID')}`;
}

function getDiscordAuthUrl(player: alt.Player) {
  alt.logDebug(player.id, 'requestedLoginURL');
  return generateDiscordLoginURL(player);
}
