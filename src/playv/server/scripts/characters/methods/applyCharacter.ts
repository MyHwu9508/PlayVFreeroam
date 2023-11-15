import { propProperties, variationProperties } from '../../../../shared/types/outfits';
import { getHairOverlayFromIndex } from '../../../../shared/utils/hairOverlay';
import { CharacterData } from '../../../entities/characterData';
import { OutfitData } from '../../../entities/outfitData';
import alt from 'alt-server';
import { canUseClothing } from './blockedClothes';

const COLOR_TYPE = [0, 1, 1, 0, 2, 2, 0, 0, 2, 0, 1, 0, 0];

export function applyCharacter(player: alt.Player, char: CharacterData) {
  player.model = alt.hash(char.female ? 'mp_f_freemode_01' : 'mp_m_freemode_01');
  player.setHeadBlendData(
    char.headBlendData.shapeFirst,
    char.headBlendData.shapeSecond,
    char.headBlendData.shapeThird,
    char.headBlendData.skinFirst,
    char.headBlendData.skinSecond,
    char.headBlendData.skinThird,
    char.headBlendData.shapeMix,
    char.headBlendData.skinMix,
    char.headBlendData.thirdMix,
  );

  for (let i = 0; i < char.faceFeature.length; i++) {
    player.setFaceFeature(i, char.faceFeature[i]);
  }

  for (let i = 0; i < char.headOverlays.length; i++) {
    player.setHeadOverlay(i, char.headOverlays[i].index, char.headOverlays[i].opacity);
    if (i === 4 && !char.overrideMakeupColor) continue;
    player.setHeadOverlayColor(i, COLOR_TYPE[i], char.headOverlays[i].colorID, char.headOverlays[i].secondColorID);
  }
  if (!char.overrideMakeupColor) {
    player.setHeadOverlayColor(4, 0, 0, 0);
  }

  player.clearDecorations();
  const hairOverlay = getHairOverlayFromIndex(char.hairIndex, char.female);
  if (hairOverlay) {
    player.addDecoration(alt.hash(hairOverlay.collection), alt.hash(hairOverlay.overlay));
    // player.emitRaw('addDecoration', alt.hash(hairOverlay.collection), alt.hash(hairOverlay.overlay));
  }
  if (char.overlays) {
    for (const [overlay, collection] of char.overlays) {
      player.addDecoration(collection, overlay);
    }
  }

  if (char.hairIndex >= 0) {
    player.setClothes(2, char.hairIndex, 0, 0);
  }
  player.setHairColor(char.hairColor.colorID);
  player.setHairHighlightColor(char.hairColor.highlightColorID);
  player.setEyeColor(char.eyeColor);

  alt.logDebug('applyFlagsafterCharacter');
  player.emitRaw('applyLobbyFlags'); //re-apply lobby flags
  player.invincible = player.getStreamSyncedMeta('inPassiveMode');
}

export function applyOutfit(player: alt.Player, outfit: OutfitData): boolean {
  if (player.model !== alt.hash(outfit.female ? 'mp_f_freemode_01' : 'mp_m_freemode_01')) {
    return false;
  }
  for (const [key, value] of Object.entries(variationProperties)) {
    const cloth = outfit[value];
    if (!canUseClothing(player, value, cloth[0], cloth[1])) continue;
    player.setClothes(Number(key), Number(cloth[0]), Number(cloth[1]));
  }
  for (const [key, value] of Object.entries(propProperties)) {
    const cloth = outfit[value];
    if (!canUseClothing(player, value, cloth[0], cloth[1])) continue;
    if (cloth[0] == -1) {
      player.clearProp(Number(key));
    } else {
      player.setProp(Number(key), Number(cloth[0]), Number(cloth[1]));
    }
  }
  const newOutfitMeta = {};
  for (const value of [...Object.values(variationProperties), ...Object.values(propProperties)]) {
    newOutfitMeta[value] = [Number(outfit[value][0]), Number(outfit[value][1])];
  }
  player.setLocalMeta('currentOutfitData', newOutfitMeta);
  return true;
}
