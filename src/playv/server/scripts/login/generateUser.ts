import * as alt from 'alt-server';
import { UUID } from 'uuidjs';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
}

export async function getDiscordUserFromPlayer(player: alt.Player): Promise<DiscordUser | null> {
  if (!player?.valid) return null;
  const playerUUID = UUID.genV4().toString();
  player.setMeta('discordUUID', playerUUID);

  const discordToken = await waitForDiscordToken(playerUUID);
  if (!discordToken) return null;

  const discordUser = await fetchDiscordUser(discordToken);
  return discordUser;
}

//Handle getting the OAuth2 Token either via the Discord Client or via the FallbackURL
async function waitForDiscordToken(playerUUID: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    //FUNCTION DECLARATIONS
    //EventHandler
    function handleDiscordToken(player, token: string) {
      resolve(token);
      clearListeners();
      alt.clearTimeout(failTimer);
      player.deleteMeta('discordUUID');
    }
    function clearListeners() {
      alt.offClient(`discord:receiveToken:${playerUUID}`, handleDiscordToken);
      alt.off(`discord:receiveToken:${playerUUID}`, handleDiscordToken);
    }
    //REGISTER EVENTS
    alt.onceClient(`discord:receiveToken:${playerUUID}`, handleDiscordToken);
    alt.once(`discord:receiveToken:${playerUUID}`, handleDiscordToken);
    //FallbackURL Event

    //FAIL TIMER
    const failTimer = alt.setTimeout(() => {
      clearListeners();
      resolve(null);
    }, 120000); //120s
  });
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
