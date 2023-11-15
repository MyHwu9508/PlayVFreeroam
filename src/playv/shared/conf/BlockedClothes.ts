import { PossibleProperties } from '../types/outfits';

//Object contains key: index of item and value: true if all blocked or number for max texture
export type BlockedClothing = Record<PossibleProperties, Record<number, true | number>>;
export const BlockedClothes: BlockedClothing = {
  mask: {},
  torso: {},
  legs: {},
  bags: {},
  shoes: {},
  accessories: {},
  undershirt: {},
  armor: {},
  decals: {},
  shirts: {},
  hats: {},
  glasses: {},
  ears: {},
  watches: {},
  bracelets: {},
};
