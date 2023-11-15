export type EditableVariations = 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type EditableProps = 0 | 1 | 2 | 6 | 7;
export type ClothIndex = {
  [key: number]: { maxIndex: number; baseIndex: number; dlcIndex: number; variations: { [index: number]: { drawable: number; hash: number; dlcName?: string } } };
};
export type ClothHash = { [key: number]: { [hash: number]: { [drawable: number]: number } } };
export type ClothMax = Record<(typeof variationProperties)[keyof typeof variationProperties] | (typeof propProperties)[keyof typeof propProperties], number>;
export type ClothMaxValues = { m: ClothMax; f: ClothMax };

export const variationProperties = {
  1: 'mask',
  3: 'torso',
  4: 'legs',
  5: 'bags',
  6: 'shoes',
  7: 'accessories',
  8: 'undershirt',
  9: 'armor',
  10: 'decals',
  11: 'shirts',
} as const;

export const variationIndex = {
  mask: 1,
  torso: 3,
  legs: 4,
  bags: 5,
  shoes: 6,
  accessories: 7,
  undershirt: 8,
  armor: 9,
  decals: 10,
  shirts: 11,
};

export const propProperties = {
  0: 'hats',
  1: 'glasses',
  2: 'ears',
  6: 'watches',
  7: 'bracelets',
} as const;

export const propIndex = {
  hats: 0,
  glasses: 1,
  ears: 2,
  watches: 6,
  bracelets: 7,
};

export type PossibleProperties = (typeof variationProperties)[keyof typeof variationProperties] | (typeof propProperties)[keyof typeof propProperties];

export type EditOutfit = {
  [key in (typeof variationProperties)[EditableVariations] | (typeof propProperties)[EditableProps]]: [number, number];
} & { id: number; profileName: string };
