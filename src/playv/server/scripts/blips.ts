import alt from 'alt-server';
import { getRankBlipColor } from '../../shared/conf/Ranks';
import { ConVar } from '../../shared/conf/ConVars';

alt.setInterval(blipTick, ConVar.BLIPS.TICKRATE);

export const allPlayerBlips = new Map<number, alt.PointBlip>();
const allPedBlips = new Map<alt.Ped, alt.PointBlip>();
export function blipTick() {
  const blipPlayers = alt.Player.all.filter(x => x?.valid && x.userData && x.getLocalMeta('isLoggedIn'));
  for (const player of blipPlayers) {
    const blip = allPlayerBlips.get(player.id);
    if (blip && blip.visible) {
      blip.pos = player.pos;
    }
  }
  for (const [ped, blip] of allPedBlips.entries()) {
    if (!ped.valid || !blip.valid) continue;
    blip.pos = ped.pos;
  }
}

export function createPedBlip(ped: alt.Ped) {
  const blip = new alt.PointBlip(ped.pos.x, ped.pos.y, ped.pos.z, true);
  blip.sprite = 273;
  blip.shortRange = true;
  blip.name = ped.model === 0x573201b8 ? 'Tomatenbaum' : 'Kaniggel';
  blip.dimension = -2147483648;
  blip.blipType = 1;
  blip.display = 2;
  blip.category = 2;
  blip.scale = ConVar.BLIPS.DEFAULT_SCALE;
  allPedBlips.set(ped, blip);
}

export function createPlayerBlip(player: alt.Player) {
  const blip = new alt.PointBlip(player.pos.x, player.pos.y, player.pos.z, true);
  blip.color = getRankBlipColor(player.userData.authlevel);
  blip.shortRange = true;
  blip.name = player.userData.username.substring(0, 15);
  blip.dimension = 0;
  blip.headingIndicatorVisible = false;
  blip.blipType = 2;
  blip.display = 2;
  blip.category = 7;
  blip.scale = ConVar.BLIPS.DEFAULT_SCALE;
  allPlayerBlips.set(player.id, blip);
}

export function deletePlayerBlip(player: alt.Player) {
  const blip = allPlayerBlips.get(player.id);
  if (blip) {
    blip.destroy();
    allPlayerBlips.delete(player.id);
  }
}

createDefaultBlips();
function createDefaultBlips() {
  const mloBlip = new alt.PointBlip(860, -2351, 30, true);
  mloBlip.dimension = -2147483648;
  mloBlip.shortRange = false;
  mloBlip.category = 1;
  mloBlip.sprite = 488;
  mloBlip.scale = ConVar.BLIPS.DEFAULT_SCALE;
  mloBlip.name = 'Car Meet MLO';
  mloBlip.color = 4;

  const blipCinema = new alt.PointBlip(-769.8346, -1258.643, 6.92844, true);
  blipCinema.dimension = -2147483648;
  blipCinema.shortRange = false;
  blipCinema.category = 1;
  blipCinema.sprite = 135;
  blipCinema.scale = 1;
  blipCinema.alpha = 255;
  blipCinema.name = 'Cinema';
  blipCinema.color = 4;
  blipCinema.scale = ConVar.BLIPS.DEFAULT_SCALE;
}
