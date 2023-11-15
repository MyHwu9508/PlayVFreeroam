import { femaleHairOverlays, maleHairOverlays } from '../data/hairOverlays';
export function getHairOverlayFromIndex(index: number, female: boolean): { collection: string; overlay: string } | null {
  if (!female && index > 36 && index < 72) index -= 36;
  if (female && index > 38 && index < 76) index -= 38;
  const overlays = female === true ? femaleHairOverlays : maleHairOverlays;
  return overlays[index];
}
