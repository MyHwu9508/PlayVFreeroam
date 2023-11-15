import alt from 'alt-client';
import native from 'natives';

export function checkNoBushes() {
  let textureRes;
  textureRes = native.getTextureResolution('ext_veg_reeds', 'nxg_prop_sl_reeds');
  if ((Math.round(textureRes.x) < 512 || textureRes.y < 256) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Bushes1' + textureRes);
    return;
  }

  textureRes = native.getTextureResolution('prop_coral_2', 'prop_coral_sweed_03');
  if ((Math.round(textureRes.x) < 128 || textureRes.y < 256) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Bushes2' + textureRes);
    return;
  }

  textureRes = native.getTextureResolution('prop_coral_2', 'prop_coral_kelp_01_lod');
  if ((Math.round(textureRes.x) < 32 || textureRes.y < 128) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Bushes3' + textureRes);
    return;
  }

  textureRes = native.getTextureResolution('prop_bbq_4', 'prop_bbq_4_ng');
  if ((Math.round(textureRes.x) < 256 || textureRes.y < 256) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Props1' + textureRes);
    return;
  }

  textureRes = native.getTextureResolution('prop_trafficlight', 'prop_traffic_01a');
  if ((Math.round(textureRes.x) < 128 || textureRes.y < 256) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Traffic Lights1' + textureRes);
    return;
  }

  textureRes = native.getTextureResolution('prop_trafficlight', 'rsn_os_security_oldwide');
  if ((Math.round(textureRes.x) < 128 || textureRes.y < 128) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Traffic Lights2' + textureRes);
    return;
  }

  textureRes = native.getTextureResolution('prop_fnclink_04', 'prop_fnclink_02_dark');
  if ((Math.round(textureRes.x) < 128 || textureRes.y < 512) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Props2' + textureRes);
    return;
  }

  if (native.isModelInCdimage(alt.hash('prop_bin_07d')) === false) {
    alt.emitServerRaw('log1n', 'No Props3');
    return;
  }

  if (0.4153 - native.getModelDimensions(alt.hash('prop_bin_07d'))[2].x > 0.1) {
    alt.emitServerRaw('log1n', 'No Props4');
    return;
  }

  if (native.isModelInCdimage(alt.hash('prop_dumpster_01a')) === false) {
    alt.emitServerRaw('log1n', 'No Props5');
    return;
  }

  if (native.isModelInCdimage(alt.hash('prop_elecbox_01a')) === false) {
    alt.emitServerRaw('log1n', 'No Props6');
    return;
  }

  textureRes = native.getTextureResolution('prop_elecbox_01a', 'prop_elecbox_01a');
  if ((Math.round(textureRes.x) < 128 || textureRes.y < 256) && Math.round(textureRes.x) != 4) {
    alt.emitServerRaw('log1n', 'No Props7' + textureRes);
    return;
  }
}
