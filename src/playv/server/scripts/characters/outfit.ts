import alt from 'alt-server';
import { outfitRepository } from './data/outfitRepository';
import { applyOutfit as applyOutf } from './methods/applyCharacter';
import { ConVar } from '../../../shared/conf/ConVars';
import { generateNewOutfit } from './methods/generateRandomNewChar';

function isFemale(player: alt.Player) {
  const female = player.model === alt.hash('mp_f_freemode_01');
  return female;
}

export function applyOutfit(player: alt.Player, outfitID: number) {
  const outfit = outfitRepository.getByID(player, outfitID);
  if (!outfit) return console.error('Outfit not found');
  try {
    const res = applyOutf(player, outfit);
    if (!res) return; //Wrong gender
  } catch (err) {
    alt.logError('[CHAR]', err);
    //Delete outfit
    return;
  }
  player.setLocalMeta('currentOutfit', outfitID);
  player.setLocalMeta('currentOutfitName', outfit.profileName);
  player.userData['lastOutfitID' + (isFemale(player) ? 'F' : 'M')] = outfitID;
}

export async function createNewOutfit(player: alt.Player, name: string) {
  if (!name || name.length > ConVar.ALL.MAX_SAVENAME_LENGTH) return player.pushToast('error', 'Name too long!');
  const data = generateNewOutfit(isFemale(player));
  const outfit = {
    ...data,
    userID: player.userData.userID,
    profileName: name,
  };
  const res = await outfitRepository.save(player, outfit);
  applyOutfit(player, res.id);
}

export async function deleteOutfit(player: alt.Player, id: number) {
  outfitRepository.deleteOutfit(player, id);
  if (player.getLocalMeta('currentOutfit') === id) {
    applyUsedFirstNewOutfit(player);
  }
}

export async function applyUsedFirstNewOutfit(player: alt.Player) {
  const outfitStr = 'lastOutfitID' + (isFemale(player) ? 'F' : 'M');
  let outfit = outfitRepository.getByID(player, player.userData[outfitStr]);
  if (!outfit) {
    outfit = outfitRepository.getFirst(player, isFemale(player));
  }
  if (!outfit) {
    await createNewOutfit(player, player.userData.username);
  } else {
    applyOutfit(player, outfit.id);
  }
}
