/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client';
import * as native from 'natives';
import { getRankDisplayColor, getRankDisplayName } from '../../shared/conf/Ranks';
import { getLobbySetting } from '../systems/lobby';
import { LocalStorage } from '../systems/localStorage';
const minFontSize = 0.2;

function getPrefix(player: alt.Player) {
  const authLevel: number = player.getStreamSyncedMeta('authlevel') ?? 0;
  if (authLevel === 0) return '';
  return `${getRankDisplayColor(authLevel)}${getRankDisplayName(authLevel)}~w~`;
}

export function nametagTick() {
  if (alt.getMeta('showHud') === false) return;
  if (LocalStorage.get('displayAnyNametag') === false) return; //if player does not want to see any nametags, return
  let drawDistance = getLobbySetting('nametagDrawDistance');
  if (alt.getMeta('crazyMazyNametags')) drawDistance = 500;
  if (drawDistance === 0) return;
  const cameraPos = native.getGameplayCamCoord();
  const frameTime = native.getFrameTime();

  const allPlayers = alt.Player.streamedIn;
  const showOwnNametag = LocalStorage.get('displayOwnNametag');

  for (let i = showOwnNametag ? -1 : 0, n = allPlayers.length; i < n; i++) {
    const player = i === -1 ? localPlayer : allPlayers[i];
    if (!player?.scriptID) continue;
    if (!native.hasEntityClearLosToEntity(alt.Player.local, player, 17) && !alt.getMeta('crazyMazyNametags')) continue;

    const name = player.getStreamSyncedMeta('username') as string;
    if (name === undefined || name === 'pending') continue;

    //let { x, y, z } = native.getPedBoneCoords(player, 12844, 0, 0, 0);
    let { x, y, z } = alt.getPedBonePos(player.scriptID, 12844);
    const dist = cameraPos.distanceTo(new alt.Vector3(x, y, z));
    if (dist > drawDistance) continue;
    const scale = (2 * dist * Math.tan((native.getGameplayCamFov() * Math.PI) / 360)) / 2;
    const fontSize = Math.max(0.9 / scale, minFontSize);
    z += 0.24 + 0.03 * scale;

    const entity = player.vehicle ? player.vehicle : player;
    const vector = native.getEntityVelocity(entity);

    // Names
    const modifiedName = `~h~${getPrefix(player)} ${name}`;

    //calc text width for icons
    native.beginTextCommandGetScreenWidthOfDisplayText('STRING');
    native.setTextFont(0);
    native.setTextScale(fontSize, fontSize);
    native.addTextComponentSubstringPlayerName(modifiedName);
    const startPositionAfterText = native.endTextCommandGetScreenWidthOfDisplayText(true);

    //draw text
    native.setDrawOrigin(x + vector.x * frameTime, y + vector.y * frameTime, z + vector.z * frameTime, false);

    native.beginTextCommandDisplayText('STRING');
    native.setTextFont(0);
    native.setTextScale(fontSize, fontSize);
    native.setTextCentre(true);
    native.setTextColour(255, 255, 255, 175);
    native.setTextOutline();
    native.addTextComponentSubstringPlayerName(modifiedName);
    native.endTextCommandDisplayText(0, 0, 0);

    //draw sprites
    let drawXPos = startPositionAfterText / 2;

    if (player.getStreamSyncedMeta('inPassiveMode') || player.getStreamSyncedMeta('spawnProtection')) {
      native.drawSpriteArxWithUv('mp_gamer_info', 'overhead_icon_texture', drawXPos, 0, fontSize * 0.03, fontSize * 0.04, 0.5, 0.25, 0.75, 0.5, 1, 255, 255, 255, 175, 0);
      drawXPos += fontSize * 0.03;
    }

    if (player.getStreamSyncedMeta('isChatting')) {
      native.drawSpriteArxWithUv('mp_gamer_info', 'overhead_icon_texture', drawXPos, 0, fontSize * 0.03, fontSize * 0.04, 0.5, 0.5, 0.75, 0.75, 1, 255, 255, 255, 175, 0);
      drawXPos += fontSize * 0.03;
    }

    if (player.getStreamSyncedMeta('isTalking')) {
      native.drawSpriteArxWithUv('mp_gamer_info', 'overhead_icon_texture', drawXPos, 0, fontSize * 0.03, fontSize * 0.04, 0, 0, 0.25, 0.25, 1, 255, 255, 255, 175, 0);
      drawXPos += fontSize * 0.03;
    }
    native.clearDrawOrigin();
  }
}
