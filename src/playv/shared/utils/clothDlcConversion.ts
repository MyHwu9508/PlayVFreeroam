import alt from 'alt-shared';
import { ClothHash, ClothIndex, propProperties, variationProperties } from '../types/outfits';

const m_clothIndex: ClothIndex = JSON.parse(alt.File.read('@assets/dump/cloth/cloth_m_index.json'));
const m_clothHash: ClothHash = JSON.parse(alt.File.read('@assets/dump/cloth/cloth_m_hash.json'));
const f_clothIndex: ClothIndex = JSON.parse(alt.File.read('@assets/dump/cloth/cloth_f_index.json'));
const f_clothHash: ClothHash = JSON.parse(alt.File.read('@assets/dump/cloth/cloth_f_hash.json'));
const m_propIndex: ClothIndex = JSON.parse(alt.File.read('@assets/dump/cloth/prop_m_index.json'));
const m_propHash: ClothHash = JSON.parse(alt.File.read('@assets/dump/cloth/prop_m_hash.json'));
const f_propIndex: ClothIndex = JSON.parse(alt.File.read('@assets/dump/cloth/prop_f_index.json'));
const f_propHash: ClothHash = JSON.parse(alt.File.read('@assets/dump/cloth/prop_f_hash.json'));

function getTypeIndex(src: 'cloth' | 'prop', type: string) {
  if (src === 'cloth') {
    return Number(Object.entries(variationProperties).find(([, value]) => value === type)[0]);
  } else {
    return Number(Object.entries(propProperties).find(([, value]) => value === type)[0]);
  }
}

function getMap(female: boolean, src: 'cloth' | 'prop', direction: 'index' | 'hash') {
  if (female) {
    if (src === 'cloth') {
      return direction === 'index' ? f_clothIndex : f_clothHash;
    } else {
      return direction === 'index' ? f_propIndex : f_propHash;
    }
  } else {
    if (src === 'cloth') {
      return direction === 'index' ? m_clothIndex : m_clothHash;
    } else {
      return direction === 'index' ? m_propIndex : m_propHash;
    }
  }
}

export function clothGetDlcOfIndex(src: 'cloth' | 'prop', female: boolean, property: string, index: number) {
  const map = getMap(female, src, 'index') as ClothIndex;
  const typeIndex = getTypeIndex(src, property);
  return map[typeIndex].variations[index];
}

export function clothGetIndexOfHash(src: 'cloth' | 'prop', female: boolean, property: string, hash: number, dlcDrawable: number) {
  const map = getMap(female, src, 'hash') as ClothHash;
  const typeIndex = getTypeIndex(src, property);
  return map[typeIndex][hash][dlcDrawable];
}

export function getMaxIndece() {
  const maxIndeceMale: Record<string, number> = {};
  const maxIndeceFemale: Record<string, number> = {};
  for (const [key, value] of Object.entries(variationProperties)) {
    maxIndeceMale[value] = m_clothIndex[key].maxIndex;
    maxIndeceFemale[value] = f_clothIndex[key].maxIndex;
  }
  for (const [key, value] of Object.entries(propProperties)) {
    maxIndeceMale[value] = m_propIndex[key].maxIndex;
    maxIndeceFemale[value] = f_propIndex[key].maxIndex;
  }
  return { m: maxIndeceMale, f: maxIndeceFemale };
}
