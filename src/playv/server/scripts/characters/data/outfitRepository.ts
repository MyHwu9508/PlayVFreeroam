import { OutfitData } from '../../../entities/outfitData';
import { AppDataSource } from '../../../systems/db/TypeORM';
import chalk from 'chalk';
import alt from 'alt-server';

const OUTFITS = new Map<number, OutfitData>();

AppDataSource.getRepository(OutfitData)
  .find()
  .then(outfits => {
    for (const outfit of outfits) {
      OUTFITS.set(outfit.id, outfit);
    }
    alt.log(chalk.bold.overline.underline.magentaBright(`${OUTFITS.size} outfits cached`));
  });

function getAll(player: alt.Player): OutfitData[] {
  const outfits: OutfitData[] = [];
  for (const outfit of OUTFITS.values()) {
    if (!outfit) continue;
    if (outfit?.userID === player.userData.userID) outfits.push(outfit);
  }
  return outfits;
}

function getByID(player: alt.Player, outfitId: number): OutfitData | undefined {
  const outfit = OUTFITS.get(outfitId);
  if (!outfit) return undefined;
  if (outfit.userID !== player.userData.userID) return undefined;
  return outfit;
}

function getFirst(player: alt.Player, female: boolean) {
  for (const outfit of OUTFITS.values()) {
    if (outfit.userID === player.userData.userID && outfit.female === female) return outfit;
  }
  return undefined;
}

async function save(player: alt.Player, outfit: OutfitData) {
  const res = await AppDataSource.getRepository(OutfitData).save(outfit);
  OUTFITS.set(res.id, res);
  return res;
}

function deleteOutfit(player: alt.Player, id: number) {
  OUTFITS.delete(id);
  AppDataSource.getRepository(OutfitData).delete({
    id: id,
    userID: player.userData.userID,
  });
}

export const outfitRepository = {
  getAll,
  getByID,
  getFirst,
  save,
  deleteOutfit,
};
