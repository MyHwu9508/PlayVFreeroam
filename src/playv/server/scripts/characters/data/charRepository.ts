import { AppDataSource } from '../../../systems/db/TypeORM';
import { CharacterData } from '../../../entities/characterData';
import chalk from 'chalk';
import alt from 'alt-server';

const CHARACTERS = new Map<number, CharacterData>();

AppDataSource.getRepository(CharacterData)
  .find()
  .then(characters => {
    for (const char of characters) {
      char.overlays = (char.overlays || []).map(overlay => [Number(overlay[0]), Number(overlay[1])]);
      CHARACTERS.set(char.id, char);
    }
    alt.log(chalk.bold.overline.underline.magentaBright(`${CHARACTERS.size} characters cached`));
  });

function getAll(player: alt.Player): CharacterData[] {
  const chars: CharacterData[] = [];
  for (const char of CHARACTERS.values()) {
    if (!char) continue;
    if (char?.userID === player.userData.userID) chars.push(char);
  }
  return chars;
}

function getByID(player: alt.Player, characterId: number): CharacterData | undefined {
  const char = CHARACTERS.get(characterId);
  if (!char) return undefined;
  if (char.userID !== player.userData.userID) return undefined;
  return char;
}

function getFirst(player: alt.Player) {
  for (const char of CHARACTERS.values()) {
    if (char.userID === player.userData.userID) return char;
  }
  return undefined;
}

async function save(player: alt.Player, character: CharacterData) {
  const res = await AppDataSource.getRepository(CharacterData).save(character);
  CHARACTERS.set(character.id, res);
  return res;
}

function deleteChar(player: alt.Player, id: number) {
  CHARACTERS.delete(id);
  AppDataSource.getRepository(CharacterData).delete({
    id: id,
    userID: player.userData.userID,
  });
}

export const charRepository = {
  getAll,
  getByID,
  getFirst,
  save,
  deleteChar,
};
