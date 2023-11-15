import { XMLBuilder } from 'fast-xml-parser';
import alt from 'alt-client';
import { CharacterData } from '../../../server/entities/characterData';
import { propProperties, variationProperties } from '../../../shared/types/outfits';
import { pushToast } from '../../ui/hud/toasts';
import { getHairOverlayFromIndex } from '../../../shared/utils/hairOverlay';

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@@',
  suppressBooleanAttributes: false,
  format: true,
});

function buildMenyooXML(char: CharacterData, outfit: Record<string, [number, number]>) {
  const model = alt.hash((char ?? outfit).female ? 'mp_f_freemode_01' : 'mp_m_freemode_01');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xml: any = {
    '?xml': {
      '@@version': '1.0',
      '@@encoding': 'ISO-8859-1',
    },
    OutfitPedData: {
      ClearDecalOverlays: true,
      ModelHash: '0x' + model.toString(16),
      HashName: '0x' + model.toString(16),
      Type: 1,
      Dynamic: true,
      FrozenPos: false,
      InitialHandle: 237470,
      OpacityLevel: 255,
      IsVisible: true,
    },
  };

  if (char) {
    const facialFeatures = {};
    for (let i = 0; i < 20; i++) {
      facialFeatures[`_${i}`] = char.faceFeature[i] ?? 0;
    }
    const overlays = {};
    for (let i = 0; i < 13; i++) {
      overlays[`_${i}`] = {
        '@@index': char.headOverlays[i]?.index ?? 0,
        '@@opacity': char.headOverlays[i]?.opacity ?? 0,
        '@@colour': char.headOverlays[i]?.colorID ?? 0,
        '@@colourSecondary': char.headOverlays[i]?.secondColorID ?? 0,
      };
    }

    const tattoos = [];
    for (const [overlay, collection] of char.overlays ?? []) {
      tattoos.push({ '@@collection': '0x' + collection.toString(16), '@@overlay': '0x' + overlay.toString(16) });
    }
    const hairOverlay = getHairOverlayFromIndex(char.hairIndex, char.female);
    if (hairOverlay) {
      tattoos.push({ '@@collection': '0x' + alt.hash(hairOverlay.collection).toString(16), '@@value': '0x' + alt.hash(hairOverlay.overlay).toString(16) });
    }
    let tattooDecals;
    if (tattoos.length > 0) {
      tattooDecals = {
        ':anonymous': tattoos,
      };
    }
    xml.OutfitPedData.PedProperties = {
      IsStill: false,
      CanRagdoll: true,
      HasShortHeight: false,
      HeadFeatures: {
        '@@WasInArray': true,
        HairColour: char.hairColor.colorID,
        HairHighlightColour: char.hairColor.highlightColorID,
        EyeColour: char.eyeColor,
        ShapeAndSkinTone: {
          ShapeFatherId: char.headBlendData.shapeFirst,
          ShapeMotherId: char.headBlendData.shapeSecond,
          ShapeOverrideId: char.headBlendData.shapeThird,
          ToneFatherId: char.headBlendData.skinFirst,
          ToneMotherId: char.headBlendData.skinSecond,
          ToneOverrideId: char.headBlendData.skinThird,
          ShapeVal: char.headBlendData.shapeMix,
          ToneVal: char.headBlendData.skinMix,
          OverrideVal: char.headBlendData.shapeMix,
          IsP: false,
        },
        FacialFeatures: facialFeatures,
        Overlays: overlays,
      },
    };
    if (tattooDecals) {
      xml.OutfitPedData.PedProperties.TattooLogoDecals = tattooDecals;
    }
  }

  const components = {
    _0: '0,0',
    _2: `${char?.hairIndex ?? 0},0`,
  };
  for (const [key, value] of Object.entries(variationProperties)) {
    components[`_${key}`] = `${outfit[value][0]},${outfit[value][1]}`;
  }
  xml.OutfitPedData.PedProperties.PedComps = components;

  if (outfit) {
    const props = {
      _3: '-1,-1',
      _4: '-1,-1',
      _5: '-1,-1',
      _8: '-1,-1',
      _9: '-1,-1',
    };
    for (const [key, value] of Object.entries(propProperties)) {
      props[`_${key}`] = `${outfit[value][0]},${outfit[value][1]}`;
    }
    xml.OutfitPedData.PedProperties.PedProps = props;
  }
  const xmlString = builder.build(xml);
  return xmlString;
}

export function getXMLFromCharacter(char: CharacterData, outfit: Record<string, [number, number]>): string | undefined {
  try {
    const xmlString = buildMenyooXML(char, outfit);
    return xmlString;
  } catch (err) {
    console.error(err);
    pushToast('error', 'Error exporting to Menyoo');
    return undefined;
  }
}
