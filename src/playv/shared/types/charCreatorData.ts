import { CharacterData } from '../../server/entities/characterData';
import { OutfitData } from '../../server/entities/outfitData';

export type CharEditorData = {
  headBlendData: {
    shapeFirst: number;
    shapeSecond: number;
    shapeThird: number;
    skinFirst: number;
    skinSecond: number;
    skinThird: number;
    shapeMix: number;
    skinMix: number;
    thirdMix: number;
  };
  faceFeature: Array<number>;
  headOverlays: Array<{
    index: number;
    opacity: number;
    colorID: number;
    secondColorID: number;
  }>;
  overrideMakeupColor: boolean;
  eyeColor: number;
  hairColor: {
    colorID: number;
    highlightColorID: number;
  };
  female: boolean;
  hairIndex: number;
  overlays: string[];
};

export type CharEditorMetaData = {
  profileName: string;
};
export type MenyooExportData = {
  char?: CharacterData;
  outfit?: OutfitData;
};
