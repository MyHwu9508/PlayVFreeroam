import { ConVar } from '../../../shared/conf/ConVars';
import { onPromiseClient } from '../../utils/promiseEvents';
import { applyCharacter, applyUsedFirstNewCharacter, createNewCharacter, randomizeCharacter } from './character';
import { charRepository } from './data/charRepository';
import alt from 'alt-server';
import { outfitRepository } from './data/outfitRepository';
import { applyOutfit, applyUsedFirstNewOutfit, createNewOutfit } from './outfit';
import { propIndex, variationIndex } from '../../../shared/types/outfits';
import { generateNewOutfit } from './methods/generateRandomNewChar';
import { canUseClothing } from './methods/blockedClothes';

//Character
onPromiseClient('getSavedCharacters', (player) => {
  return charRepository.getAll(player).map((char) => [char.id, char.profileName]) as [number, string][];
});
alt.onClient('selectCharacter', async (player, characterID: number) => {
  await applyCharacter(player, characterID);
  player.saveToDB();
});
alt.onClient('createCharacter', async (player, name: string) => {
  player.canPerformAction('createCharacter', 5000);
  if (charRepository.getAll(player).length >= ConVar.CHARACTER.MAX_SAVED)
    return player.pushToast('warning', 'Max characters reached!');
  if (name.length > ConVar.ALL.MAX_SAVENAME_LENGTH) return player.pushToast('warning', 'Name too long!');
  await createNewCharacter(player, name);
  player.saveToDB();
});
alt.onClient('deleteCharacter', async (player, id: number) => {
  player.canPerformAction('deleteCharacter', 250);
  charRepository.deleteChar(player, id);
  if (player.getLocalMeta('currentCharacter') === id) {
    await applyUsedFirstNewCharacter(player);
  }
  player.saveToDB();
});
alt.onClient('randomizeCurrentCharacter', async (player) => {
  player.canPerformAction('deleteCharacter', 500);
  randomizeCharacter(player, player.getLocalMeta('currentCharacter'));
});
alt.onClient('duplicateCharacter', async (player, id, name) => {
  player.canPerformAction('duplicateCharacter', 5000);
  if (charRepository.getAll(player).length >= ConVar.CHARACTER.MAX_SAVED)
    return player.pushToast('warning', 'Max characters reached!');
  if (!name) return player.pushToast('warning', 'Name required!');
  if (name.length > ConVar.ALL.MAX_SAVENAME_LENGTH) return player.pushToast('warning', 'Name too long!');
  const char = charRepository.getByID(player, id);
  if (!char) return;
  const newChar = {
    ...char,
    profileName: name,
    id: undefined,
    timestamp: undefined,
  };
  const res = await charRepository.save(player, newChar);
  await applyCharacter(player, res.id);
  player.saveToDB();
});
alt.onClient('startCharEditor', (player) => {
  player.setMeta('previousDimension', player.dimension);
  player.dimension = player.privateDimension;
  player.emit('startCharEditor');
});
alt.onClient('finishCharEditor', async (player, data) => {
  player.dimension = player.getMeta('previousDimension');
  if (!data) return;
  const res = await charRepository.save(player, data);
  await applyCharacter(player, res.id);
  player.saveToDB();
});
alt.onClient('renameCharacter', async (player, id: number, name: string) => {
  player.canPerformAction('renameCharacter', 1000);
  const char = charRepository.getByID(player, id);
  if (!char) return;
  char.profileName = name;
  player.setLocalMeta('currentCharacterName', name);
  charRepository.save(player, char);
});

//Outfit
const outfitSaveMap = new Map<number, NodeJS.Timeout>();
alt.onRpc('getSavedOutfits', async (player) => {
  const female = player.model === alt.hash('mp_f_freemode_01');
  const list = outfitRepository.getAll(player);
  const res: [number, string][] = [];
  for (const outfit of list) {
    if (outfit.female === female) res.push([outfit.id, outfit.profileName]);
  }
  return res;
});
alt.onClient('selectOutfit', (player, outfitID: number) => {
  applyOutfit(player, outfitID);
  player.saveToDB();
});
alt.onClient('renameOutfit', async (player, id: number, name: string) => {
  player.canPerformAction('renameOutfit', 1000);
  const outfit = outfitRepository.getByID(player, id);
  if (!outfit) return;
  outfit.profileName = name;
  player.setLocalMeta('currentOutfitName', name);
  outfitRepository.save(player, outfit);
});
alt.onClient('randomizeCurrentOutfit', async (player) => {
  player.canPerformAction('randomizeCurrentOutfit', 500);
  const outfit = outfitRepository.getByID(player, player.getLocalMeta('currentOutfit'));
  if (!outfit) return;
  const newOutfit = {
    ...generateNewOutfit(outfit.female),
    id: outfit.id,
    timestamp: outfit.timestamp,
    userID: outfit.userID,
    profileName: outfit.profileName,
  };
  await outfitRepository.save(player, newOutfit);
  applyOutfit(player, newOutfit.id);
  player.saveToDB();
});
alt.onClient('deleteOutfit', async (player, id: number) => {
  player.canPerformAction('deleteOutfit', 250);
  outfitRepository.deleteOutfit(player, id);
  if (player.getLocalMeta('currentOutfit') === id) {
    await applyUsedFirstNewOutfit(player);
  }
  player.saveToDB();
});
alt.onClient('duplicateOutfit', async (player, id, name) => {
  player.canPerformAction('duplicateOutfit', 5000);
  if (outfitRepository.getAll(player).length >= ConVar.OUTFITS.MAX_SAVED)
    return player.pushToast('warning', 'Max outfits reached!');
  if (!name) return player.pushToast('warning', 'Name required!');
  if (name.length > ConVar.ALL.MAX_SAVENAME_LENGTH) return player.pushToast('warning', 'Name too long!');
  const outfit = outfitRepository.getByID(player, id);
  if (!outfit) return;
  const newOutfit = {
    ...outfit,
    profileName: name,
    id: undefined,
    timestamp: undefined,
  };
  const res = await outfitRepository.save(player, newOutfit);
  applyOutfit(player, res.id);
  player.saveToDB();
});
alt.onClient('createOutfit', async (player, name: string) => {
  player.canPerformAction('createOutfit', 5000);
  if (outfitRepository.getAll(player).length >= ConVar.OUTFITS.MAX_SAVED)
    return player.pushToast('warning', 'Max outfits reached!');
  await createNewOutfit(player, name);
  player.saveToDB();
});
alt.onClient('changeCloth', async (player, component, drawable, texture) => {
  if (!canUseClothing(player, component, drawable, texture)) return;
  if (component in variationIndex) {
    const index = variationIndex[component];
    player.setClothes(index, drawable, texture, 0);
  } else {
    if (drawable === -1) {
      player.clearProp(propIndex[component]);
    } else {
      const index = propIndex[component];
      player.setProp(index, drawable, texture);
    }
  }
  player.setLocalMeta('currentOutfitData', {
    ...player.getLocalMeta('currentOutfitData'),
    [component]: [drawable, texture],
  });
  const data = player.getLocalMeta('currentOutfitData');
  const outfit = outfitRepository.getByID(player, player.getLocalMeta('currentOutfit'));
  if (outfitSaveMap.has(outfit.id)) clearTimeout(outfitSaveMap.get(outfit.id));
  outfitSaveMap.set(
    outfit.id,
    setTimeout(() => {
      outfitRepository.save(player, { ...outfit, ...data });
      outfitSaveMap.delete(outfit.id);
    }, 1000),
  );
});

//Menyoo
alt.onClient('importCharacter', async (player, char, outfit) => {
  player.canPerformAction('importCharacter', 5000);
  char.id = undefined;
  char.timestamp = undefined;
  char.userID = player.userData.userID;
  outfit.id = undefined;
  outfit.timestamp = undefined;
  outfit.userID = player.userData.userID;
  const newChar = await charRepository.save(player, char);
  const newOutfit = await outfitRepository.save(player, outfit);
  await applyCharacter(player, newChar.id);
  applyOutfit(player, newOutfit.id);
  player.pushToast('success', 'Imported Character & Outfit as "Menyoo Import"!');
  setTimeout(() => player.saveToDB(), 100);
});
