import alt from 'alt-server';
import { BlockedClothes } from '../../../../shared/conf/BlockedClothes';
export function canUseClothing(player: alt.Player, property: string, index: number, texture: number) {
  if (player.userData.authlevel > 0) return true;
  const item = BlockedClothes?.[property]?.[index];
  if (item === true || Number(item) < texture) return false;
  return true;
}
