import tattooJson from '../data/pedOverlayCollections.json';

export const tattooData: Record<string, [string, string, string, string][]> = {};
for (const collection of tattooJson) {
  for (const overlay of collection.Overlays) {
    if (!tattooData[overlay.ZoneName]) tattooData[overlay.ZoneName] = [];
    tattooData[overlay.ZoneName].push([overlay.Gender, overlay.OverlayName, String(overlay.OverlayHash), String(collection.CollectionHash)]);
  }
}
