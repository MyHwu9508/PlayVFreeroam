import { randomOutfitOptions } from '../../../../shared/conf/randomOutfitOptions';
import { generateExponentialRandom, getRandomInt } from '../../../../shared/utils/math/numbers';
import { OutfitData } from '../../../entities/outfitData';

const LASTMALEHAIR = 81;
const LASTFEMALEHAIR = 84;

const validBodyHair = Array(27)
  .fill(0)
  .map((_, i) => i);
validBodyHair.push(52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63);
function generateHairColor() {
  return { hair: validBodyHair[getRandomInt(0, validBodyHair.length)], highlight: 0 };
}
const validMaleOptions = Array(36)
  .fill(0)
  .map((_, i) => i);
validMaleOptions.splice(23, 1);
validMaleOptions.push(
  ...Array(LASTMALEHAIR - 71)
    .fill(0)
    .map((_, i) => i + 71),
);
const validFemaleOptions = Array(39)
  .fill(0)
  .map((_, i) => i);
validFemaleOptions.splice(24, 1);
validFemaleOptions.push(
  ...Array(LASTFEMALEHAIR - 76)
    .fill(0)
    .map((_, i) => i + 76),
);

function generateHairIndex(isFemale: boolean) {
  return isFemale ? validFemaleOptions[getRandomInt(0, validFemaleOptions.length)] : validMaleOptions[getRandomInt(0, validMaleOptions.length)];
}

export function generateNewCharacter() {
  const isFemale = Math.random() > 0.5;
  const { hair, highlight } = generateHairColor();
  return {
    overrideMakeupColor: false,
    eyeColor: getRandomInt(0, 11),
    headBlendData: {
      shapeFirst: isFemale ? getRandomInt(21, 41) : getRandomInt(0, 20),
      shapeSecond: isFemale ? getRandomInt(21, 41) : getRandomInt(0, 20),
      shapeThird: isFemale ? getRandomInt(21, 41) : getRandomInt(0, 20),
      skinFirst: getRandomInt(0, 45),
      skinSecond: getRandomInt(0, 45),
      skinThird: getRandomInt(0, 45),
      shapeMix: Math.random(),
      skinMix: Math.random(),
      thirdMix: Math.random() * 0.6,
    },
    faceFeature: Array(20)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    female: isFemale,
    overlays: [],
    hairColor: { colorID: hair, highlightColorID: highlight },
    hairIndex: generateHairIndex(isFemale) ?? 0,
    headOverlays: [
      // blemishes 0
      { secondColorID: 0, colorID: 0, index: getRandomInt(0, 23), opacity: generateExponentialRandom() },
      // beard 1
      { secondColorID: 0, colorID: hair, index: isFemale ? 0 : getRandomInt(0, 29), opacity: isFemale ? 0 : Math.random() > 0.4 ? Math.random() * 0.4 + 0.6 : 0 },
      // eyebrows 2
      { secondColorID: 0, colorID: hair, index: getRandomInt(0, 34), opacity: Math.random() * 0.5 + 0.5 },
      // ageing 3
      { secondColorID: 0, colorID: 0, index: getRandomInt(0, 14), opacity: generateExponentialRandom() },
      // makeup 4
      { secondColorID: 0, colorID: 0, index: 0, opacity: 0 },
      // blush 5
      { secondColorID: 0, colorID: 0, index: 0, opacity: 0 },
      // complexion 6
      { secondColorID: 0, colorID: 0, index: getRandomInt(0, 11), opacity: generateExponentialRandom() },
      // sundamage 7
      { secondColorID: 0, colorID: 0, index: getRandomInt(0, 10), opacity: generateExponentialRandom() },
      // lipstick 8
      { secondColorID: 0, colorID: 0, index: 0, opacity: 0 },
      // moles 9
      { secondColorID: 0, colorID: 0, index: getRandomInt(0, 17), opacity: generateExponentialRandom() },
      // chesthair 10
      { secondColorID: 0, colorID: hair, index: isFemale ? 0 : getRandomInt(0, 16), opacity: isFemale ? 0 : Math.random() },
      // bodyblemishes 11
      { secondColorID: 0, colorID: 0, index: getRandomInt(0, 11), opacity: generateExponentialRandom() },
    ],
  };
}

export function generateNewOutfit(female: boolean): OutfitData {
  const outfit: OutfitData = {
    userID: 0,
    profileName: '',
    female: female,
    mask: [0, 0],
    torso: [0, 0],
    legs: [0, 0],
    bags: [0, 0],
    shoes: [0, 0],
    accessories: [0, 0],
    undershirt: [0, 0],
    armor: [0, 0],
    decals: [0, 0],
    shirts: [0, 0],
    hats: [-1, 0],
    glasses: [-1, 0],
    ears: [-1, 0],
    watches: [-1, 0],
    bracelets: [-1, 0],
  };
  let rand: typeof randomOutfitOptions.m;
  if (female) {
    rand = randomOutfitOptions.f;
  } else {
    rand = randomOutfitOptions.m;
  }

  if (Math.random() > 0.9) {
    const option = rand.mask[getRandomInt(0, rand.mask.length - 1)];
    outfit.mask = [option[0], getRandomInt(0, option[1])];
  }
  const legOption = rand.legs[getRandomInt(0, rand.legs.length - 1)];
  outfit.legs = [legOption[0], getRandomInt(0, legOption[1])];
  const shoeOption = rand.shoes[getRandomInt(0, rand.shoes.length - 1)];
  outfit.shoes = [shoeOption[0], getRandomInt(0, shoeOption[1])];

  const shirtTotalOption = rand.shirt[getRandomInt(0, rand.shirt.length - 1)];
  const torsoIndex = shirtTotalOption[0][0][0];
  outfit.torso = [torsoIndex, 0];

  const undershirtOption = shirtTotalOption[1][getRandomInt(0, shirtTotalOption[1].length - 1)];
  outfit.undershirt = [undershirtOption[0], getRandomInt(0, undershirtOption[1])];

  const overShirtOption = shirtTotalOption[2][getRandomInt(0, shirtTotalOption[2].length - 1)];
  outfit.shirts = [overShirtOption[0], getRandomInt(0, overShirtOption[1])];
  return outfit;
}
