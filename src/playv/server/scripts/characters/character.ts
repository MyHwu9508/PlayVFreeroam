import alt from 'alt-server';
import { charRepository } from './data/charRepository';
import { applyCharacter as applyChar } from './methods/applyCharacter';
import { generateNewCharacter } from './methods/generateRandomNewChar';
import { applyUsedFirstNewOutfit } from './outfit';

export async function applyCharacter(player: alt.Player, charID: number) {
  const char = charRepository.getByID(player, charID);
  if (!char) return;
  try {
    applyChar(player, char);
  } catch (err) {
    alt.logError('[CHAR]', err);
    //Delete char
    return;
  }
  player.setLocalMeta('currentCharacter', charID);
  player.setLocalMeta('currentCharacterName', char.profileName);
  player.setLocalMeta('currentCharacterData', char);
  player.userData.lastCharacterID = charID;
  applyUsedFirstNewOutfit(player);
}

export async function createNewCharacter(player: alt.Player, name: string) {
  if (!name) return player.pushToast('error', 'Name required!');
  const data = generateNewCharacter();
  const char = {
    ...data,
    userID: player.userData.userID,
    profileName: name,
  };
  const res = await charRepository.save(player, char);
  applyCharacter(player, res.id);
}

export async function randomizeCharacter(player: alt.Player, charID: number) {
  const char = charRepository.getByID(player, charID);
  if (!char) return;
  const data = generateNewCharacter();
  const newChar = {
    userID: player.userData.userID,
    id: charID,
    profileName: char.profileName,
    timestamp: char.timestamp,
    ...data,
  };
  const res = await charRepository.save(player, newChar);
  applyCharacter(player, res.id);
}

export async function deleteCharacter(player: alt.Player, id: number) {
  charRepository.deleteChar(player, id);
  if (player.getLocalMeta('currentCharacter') === id) {
    applyUsedFirstNewCharacter(player);
  }
}

export async function applyUsedFirstNewCharacter(player: alt.Player) {
  let char = charRepository.getByID(player, player.userData.lastCharacterID);
  if (!char) {
    char = charRepository.getFirst(player);
  }
  if (!char) {
    await createNewCharacter(player, player.userData.username);
  } else {
    applyCharacter(player, char.id);
  }
}
