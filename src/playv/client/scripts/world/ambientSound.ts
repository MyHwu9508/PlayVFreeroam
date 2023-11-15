import * as alt from 'alt-client';
import * as native from 'natives';

const allStaticEmitters = JSON.parse(alt.File.read('@assets/dump/staticEmitters.json'));

export function setAmbientSound(state: boolean) {
  if (state) {
    native.stopAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
    native.setAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL', false, false);
    native.setAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING', false, false);
    native.setAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM', false, false);
    native.setAmbientZoneState('AZ_DISTANT_SASQUATCH', false, false);
    native.setAmbientZoneState('AZL_DLC_Hei4_Island_Zones', false, false);
  } else {
    native.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
    native.setAmbientZoneListStatePersistent('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL', false, true);
    native.setAmbientZoneListStatePersistent('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING', false, true);
    native.setAmbientZoneListStatePersistent('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM', false, true);
    native.setAmbientZoneListStatePersistent('AZ_DISTANT_SASQUATCH', false, true);
    native.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', false, true);

    native.cancelAllPoliceReports();
  }

  for (const emitter of allStaticEmitters) {
    native.setStaticEmitterEnabled(emitter.Name, state);
  }
  native.setAudioFlag('LoadMPData', !state);
  native.setAudioFlag('DisableFlightMusic', !state);
  native.setAudioFlag('PoliceScannerDisabled', !state);
}
