import alt from 'alt-client';
import native from 'natives';

const h4_fake_islandxHash = alt.hash('h4_fake_islandx');
const islandCenter = new alt.Vector3(4840.571, -5174.425, 2.0);
let nearIsland = false;

export function cayoTick() {
  const distance = alt.Player.local.pos.distanceTo(islandCenter);
  native.setRadarAsExteriorThisFrame();
  native.setRadarAsInteriorThisFrame(h4_fake_islandxHash, 4700.0, -5145.0, 0, 0);
  if (nearIsland) {
    if (distance >= 3000) {
      nearIsland = false;
      native.setScenarioGroupEnabled('Heist_Island_Peds', false);
      native.setAudioFlag('PlayerOnDLCHeist4Island', false);
      native.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', false, false);
      native.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Disabled_Zones', false, false);
      native.resetDeepOceanScaler();
    }
  } else if (distance < 3000 && !nearIsland) {
    nearIsland = true;
    native.setScenarioGroupEnabled('Heist_Island_Peds', true);
    native.setAudioFlag('PlayerOnDLCHeist4Island', true);
    native.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', true, true);
    native.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Disabled_Zones', false, true);
    native.setDeepOceanScaler(0.1);
  }
}
