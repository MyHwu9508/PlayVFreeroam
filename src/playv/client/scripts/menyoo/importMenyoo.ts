import { XMLParser } from 'fast-xml-parser';
import { OutfitData } from '../../../server/entities/outfitData';
import { CharacterData } from '../../../server/entities/characterData';
import alt from 'alt-client';
import { pushToast } from '../../ui/hud/toasts';
import { z } from 'zod';

let hairHashes: number[] = undefined;
function getHairHashes() {
  if (!hairHashes) {
    hairHashes = [];
    const data = JSON.parse(alt.File.read('@assets/dump/pedOverlayCollections.json'));
    for (const collection of Object.values(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const item of (collection as any).Overlays) {
        if ((item.OverlayName as string).toLowerCase().includes('hair')) {
          hairHashes.push(item.OverlayHash);
        }
      }
    }
  }
  return hairHashes;
}

const parser = new XMLParser({
  attributeNamePrefix: '',
  ignoreAttributes: false,
  parseAttributeValue: true,
  allowBooleanAttributes: true,
});
function numeric(target: z.ZodCatch<z.ZodDefault<z.ZodNumber>> | z.ZodNumber) {
  return z.preprocess(val => Number(val), target);
}
const overlay = z
  .object({
    index: numeric(z.number().int().min(0).max(255).default(0).catch(0)),
    opacity: numeric(z.number().min(0).max(1).default(0).catch(0)),
    colour: numeric(z.number().int().min(0).max(255).default(0).catch(0)),
    colourSecondary: numeric(z.number().int().min(0).max(255).default(0).catch(0)),
  })
  .catch({
    index: 0,
    opacity: 0,
    colour: 0,
    colourSecondary: 0,
  });
const component = z
  .string()
  .default('0,0')
  .transform(val => {
    const arr = val.split(',');
    if (arr.length !== 2) return [0, 0];
    const [a, b] = arr;
    const aNum = Number(a);
    const bNum = Number(b);
    if (aNum < 0 || bNum < 0 || bNum > 255 || isNaN(aNum) || isNaN(bNum)) return [0, 0];
    return [aNum, bNum];
  })
  .catch([0, 0]);
const prop = z
  .string()
  .default('-1,0')
  .transform(val => {
    const arr = val.split(',');
    if (arr.length !== 2) return [0, 0];
    const [a, b] = arr;
    const aNum = Number(a);
    let bNum = Number(b);
    if (bNum === -1) bNum = 0;
    if (aNum < -1 || aNum > 255 || bNum < 0 || bNum > 255 || isNaN(aNum) || isNaN(bNum)) return [0, 0];
    return [aNum, bNum];
  })
  .catch([-1, 0]);
const xmlSchema = z.object({
  OutfitPedData: z.object({
    ModelHash: z.number(),
    PedProperties: z.object({
      HeadFeatures: z.object({
        HairColour: numeric(z.number().int().min(0).max(255).default(0).catch(0)),
        HairColourStreaks: numeric(z.number().int().min(0).max(255).default(0).catch(0)),
        EyeColour: numeric(z.number().int().min(0).max(255).default(0).catch(0)),
        ShapeAndSkinTone: z.object({
          ShapeFatherId: numeric(z.number().int().min(0).max(45).default(0).catch(0)),
          ShapeMotherId: numeric(z.number().int().min(0).max(45).default(0).catch(0)),
          ShapeVal: numeric(z.number().min(0).max(1).default(0).catch(0)),
          ToneFatherId: numeric(z.number().int().min(0).max(45).default(0).catch(0)),
          ToneMotherId: numeric(z.number().int().min(0).max(45).default(0).catch(0)),
          ToneVal: numeric(z.number().min(0).max(1).default(0).catch(0)),
          ShapeOverrideId: numeric(z.number().int().min(0).max(45).default(0).catch(0)),
          ToneOverrideId: numeric(z.number().int().min(0).max(45).default(0).catch(0)),
          OverrideVal: numeric(z.number().min(0).max(1).default(0).catch(0)),
        }),
        FacialFeatures: z.object({
          _0: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _1: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _2: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _3: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _4: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _5: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _6: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _7: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _8: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _9: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _10: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _11: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _12: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _13: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _14: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _15: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _16: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _17: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _18: numeric(z.number().min(-1).max(1).default(0).catch(0)),
          _19: numeric(z.number().min(-1).max(1).default(0).catch(0)),
        }),
        Overlays: z.object({
          _0: overlay,
          _1: overlay,
          _2: overlay,
          _3: overlay,
          _4: overlay,
          _5: overlay,
          _6: overlay,
          _7: overlay,
          _8: overlay,
          _9: overlay,
          _10: overlay,
          _11: overlay,
          _12: overlay,
        }),
      }),
      PedComps: z.object({
        _0: component,
        _1: component,
        _2: component,
        _3: component,
        _4: component,
        _5: component,
        _6: component,
        _7: component,
        _8: component,
        _9: component,
        _10: component,
        _11: component,
      }),
      PedProps: z.object({
        _0: prop,
        _1: prop,
        _2: prop,
        _6: prop,
        _7: prop,
      }),
      TattooLogoDecals: z
        .object({
          ':anonymous': z
            .array(
              z.object({
                collection: z.number().int(),
                value: z.number().int(),
              })
            )
            .catch([]),
        })
        .catch({
          ':anonymous': [],
        }),
    }),
  }),
});

function parseCharacterXML(xml: string) {
  const parsed = parser.parse(xml);
  const validated = xmlSchema.parse(parsed);
  const pedProperties = validated.OutfitPedData.PedProperties;
  const pedComps = pedProperties.PedComps;
  const pedProps = pedProperties.PedProps;
  const overlays = pedProperties.HeadFeatures.Overlays;
  const facialFeatures = pedProperties.HeadFeatures.FacialFeatures;
  const character: CharacterData = {
    headBlendData: {
      shapeFirst: pedProperties.HeadFeatures.ShapeAndSkinTone.ShapeFatherId,
      shapeSecond: pedProperties.HeadFeatures.ShapeAndSkinTone.ShapeMotherId,
      shapeThird: pedProperties.HeadFeatures.ShapeAndSkinTone.ShapeOverrideId,
      skinFirst: pedProperties.HeadFeatures.ShapeAndSkinTone.ToneFatherId,
      skinSecond: pedProperties.HeadFeatures.ShapeAndSkinTone.ToneMotherId,
      skinThird: pedProperties.HeadFeatures.ShapeAndSkinTone.ToneOverrideId,
      shapeMix: pedProperties.HeadFeatures.ShapeAndSkinTone.ShapeVal,
      skinMix: pedProperties.HeadFeatures.ShapeAndSkinTone.ToneVal,
      thirdMix: pedProperties.HeadFeatures.ShapeAndSkinTone.OverrideVal,
    },
    hairColor: {
      colorID: pedProperties.HeadFeatures.HairColour,
      highlightColorID: pedProperties.HeadFeatures.HairColourStreaks,
    },
    eyeColor: pedProperties.HeadFeatures.EyeColour,
    faceFeature: [
      facialFeatures._0,
      facialFeatures._1,
      facialFeatures._2,
      facialFeatures._3,
      facialFeatures._4,
      facialFeatures._5,
      facialFeatures._6,
      facialFeatures._7,
      facialFeatures._8,
      facialFeatures._9,
      facialFeatures._10,
      facialFeatures._11,
      facialFeatures._12,
      facialFeatures._13,
      facialFeatures._14,
      facialFeatures._15,
      facialFeatures._16,
      facialFeatures._17,
      facialFeatures._18,
      facialFeatures._19,
    ],
    headOverlays: [
      {
        index: overlays._0.index === 255 ? 0 : overlays._0.index,
        opacity: overlays._0.index === 255 ? 0 : overlays._0.opacity,
        colorID: overlays._0.colour,
        secondColorID: overlays._0.colourSecondary,
      },
      {
        index: overlays._1.index === 255 ? 0 : overlays._1.index,
        opacity: overlays._1.index === 255 ? 0 : overlays._1.opacity,
        colorID: overlays._1.colour,
        secondColorID: overlays._1.colourSecondary,
      },
      {
        index: overlays._2.index === 255 ? 0 : overlays._2.index,
        opacity: overlays._2.index === 255 ? 0 : overlays._2.opacity,
        colorID: overlays._2.colour,
        secondColorID: overlays._2.colourSecondary,
      },
      {
        index: overlays._3.index === 255 ? 0 : overlays._3.index,
        opacity: overlays._3.index === 255 ? 0 : overlays._3.opacity,
        colorID: overlays._3.colour,
        secondColorID: overlays._3.colourSecondary,
      },
      {
        index: overlays._4.index === 255 ? 0 : overlays._4.index,
        opacity: overlays._4.index === 255 ? 0 : overlays._4.opacity,
        colorID: overlays._4.colour,
        secondColorID: overlays._4.colourSecondary,
      },
      {
        index: overlays._5.index === 255 ? 0 : overlays._5.index,
        opacity: overlays._5.index === 255 ? 0 : overlays._5.opacity,
        colorID: overlays._5.colour,
        secondColorID: overlays._5.colourSecondary,
      },
      {
        index: overlays._6.index === 255 ? 0 : overlays._6.index,
        opacity: overlays._6.index === 255 ? 0 : overlays._6.opacity,
        colorID: overlays._6.colour,
        secondColorID: overlays._6.colourSecondary,
      },
      {
        index: overlays._7.index === 255 ? 0 : overlays._7.index,
        opacity: overlays._7.index === 255 ? 0 : overlays._7.opacity,
        colorID: overlays._7.colour,
        secondColorID: overlays._7.colourSecondary,
      },
      {
        index: overlays._8.index === 255 ? 0 : overlays._8.index,
        opacity: overlays._8.index === 255 ? 0 : overlays._8.opacity,
        colorID: overlays._8.colour,
        secondColorID: overlays._8.colourSecondary,
      },
      {
        index: overlays._9.index === 255 ? 0 : overlays._9.index,
        opacity: overlays._9.index === 255 ? 0 : overlays._9.opacity,
        colorID: overlays._9.colour,
        secondColorID: overlays._9.colourSecondary,
      },
      {
        index: overlays._10.index === 255 ? 0 : overlays._10.index,
        opacity: overlays._10.index === 255 ? 0 : overlays._10.opacity,
        colorID: overlays._10.colour,
        secondColorID: overlays._10.colourSecondary,
      },
      {
        index: overlays._11.index === 255 ? 0 : overlays._11.index,
        opacity: overlays._11.index === 255 ? 0 : overlays._11.opacity,
        colorID: overlays._11.colour,
        secondColorID: overlays._11.colourSecondary,
      },
      {
        index: overlays._12.index === 255 ? 0 : overlays._12.index,
        opacity: overlays._12.index === 255 ? 0 : overlays._12.opacity,
        colorID: overlays._12.colour,
        secondColorID: overlays._12.colourSecondary,
      },
    ],
    overrideMakeupColor: false,
    female: Number(validated.OutfitPedData.ModelHash) === alt.hash('mp_f_freemode_01'),
    overlays: validated.OutfitPedData.PedProperties.TattooLogoDecals[':anonymous']
      .map(val => [Number(val.value), Number(val.collection)])
      .filter(val => {
        const data = getHairHashes();
        if (data.includes(val[0])) return false;
        return true;
      }) as [number, number][],
    hairIndex: pedComps._2[0],
    userID: 0,
    profileName: 'Menyoo Import',
  };
  const outfit: OutfitData = {
    userID: 0,
    profileName: 'Menyoo Import',
    female: Number(validated.OutfitPedData.ModelHash) === alt.hash('mp_f_freemode_01'),
    mask: pedComps._1 as [number, number],
    torso: pedComps._3 as [number, number],
    legs: pedComps._4 as [number, number],
    bags: pedComps._5 as [number, number],
    shoes: pedComps._6 as [number, number],
    accessories: pedComps._7 as [number, number],
    undershirt: pedComps._8 as [number, number],
    armor: pedComps._9 as [number, number],
    decals: pedComps._10 as [number, number],
    shirts: pedComps._11 as [number, number],
    hats: pedProps._0 as [number, number],
    glasses: pedProps._1 as [number, number],
    ears: pedProps._2 as [number, number],
    watches: pedProps._6 as [number, number],
    bracelets: pedProps._7 as [number, number],
  };
  return [character, outfit] as const;
}

export function getCharacterFromXML(xml: string) {
  try {
    return parseCharacterXML(xml);
  } catch (err) {
    console.log(err);
    pushToast('error', "Couldn't parse XML!");
    return undefined;
  }
}
