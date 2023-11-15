//UNUSED !!!
let tvactive = false;
function CreateNamedRenderTargetForModel(name, model) {
  let handle = 0;
  if (!native.isNamedRendertargetRegistered(name)) native.registerNamedRendertarget(name, false);
  if (!native.isNamedRendertargetLinked(model)) native.linkNamedRendertarget(model);
  if (native.isNamedRendertargetRegistered(name)) handle = native.getNamedRendertargetRenderId(name);
  return handle;
}
function drawTv() {
  native.registerScriptWithAudio(0);
  native.setTvChannelPlaylist(2, 'PL_SOL_LED_GALAXY', false);
  native.setTvChannel(2);
  native.enableMovieSubtitles(true);
  tvactive = true;
}
alt.everyTick(() => {
  if (tvactive) {
    const model = native.getHashKey('ba_prop_club_screens_01');
    const handle = CreateNamedRenderTargetForModel('Club_Projector', model);
    native.setTvAudioFrontend(false);
    //native.attachTvAudioToEntity(entity);
    native.setTextRenderId(handle);
    native.setScriptGfxDrawBehindPausemenu(true);
    native.drawTvChannel(0.5, 0.5, 1.0, 1.0, 0.0, 255, 255, 255, 255);
    native.setTextRenderId(native.getDefaultScriptRendertargetRenderId());
    native.setScriptGfxDrawBehindPausemenu(false);
  } else drawTv();
});

// Details = {
//   clutter = "Int01_ba_Clutter",               -- Clutter and graffitis
//   worklamps = "Int01_ba_Worklamps",           -- Work lamps + trash
//   truck = "Int01_ba_deliverytruck",           -- Truck parked in the garage
//   dryIce = "Int01_ba_dry_ice",                -- Dry ice machines (no effects)
//   lightRigsOff = "light_rigs_off",            -- All light rigs at once but turned off
//   roofLightsOff = "Int01_ba_lightgrid_01",    -- Fake lights
//   floorTradLights = "Int01_ba_trad_lights",   -- Floor lights meant to go with the trad style
//   chest = "Int01_ba_trophy04",                -- Chest on the VIP desk
//   vaultAmmunations = "Int01_ba_trophy05",     -- (inside vault) Ammunations
//   vaultMeth = "Int01_ba_trophy07",            -- (inside vault) Meth bag
//   vaultFakeID = "Int01_ba_trophy08",          -- (inside vault) Fake ID
//   vaultWeed = "Int01_ba_trophy09",            -- (inside vault) Opened weed bag
//   vaultCoke = "Int01_ba_trophy10",            -- (inside vault) Coke doll
//   vaultCash = "Int01_ba_trophy11",            -- (inside vault) Scrunched fake money
//   Enable = function (details, state, refresh)
//       SetIplPropState(AfterHoursNightclubs.interiorId, details, state, refresh)
//   end
// }



case 'tp': {
    native.setEntityCoords(localPlayer, -1588.69, -3013.09, -79.01, false, false, false, false);
    const interior = native.getInteriorAtCoords(-1588.69, -3013.09, -79.01);

    alt.requestIpl('ba_case2_solomun');
    alt.requestIpl('ba_barriers_case2');
    alt.requestIpl('ba_int_placement_ba_interior_0_dlc_int_01_ba_milo_');
    alt.requestIpl('ba_dlc_int_01_ba');

    for (let i = 1; i <= 3; i++) {
      native.deactivateInteriorEntitySet(interior, `Int01_ba_Style0${i}`); //Style vom ganzen Club 1-3
      native.deactivateInteriorEntitySet(interior, `Int01_ba_Style0${i}_Podium`); //kleiner weirder podium im raum
    }
    native.activateInteriorEntitySet(interior, 'Int01_ba_Style02'); //Style vom ganzen Club 1-3

    for (let i = 1; i <= 9; i++) {
      native.deactivateInteriorEntitySet(interior, `Int01_ba_clubname_0${i}`); //Clubname
    }
    native.activateInteriorEntitySet(interior, 'Int01_ba_clubname_04');

    native.deactivateInteriorEntitySet(interior, 'light_rigs_off'); //?
    native.deactivateInteriorEntitySet(interior, 'roof_lights_off'); //?
    native.deactivateInteriorEntitySet(interior, 'Int01_ba_Worklamps'); // Work lamps + trash

    native.activateInteriorEntitySet(interior, 'int01_ba_equipment_setup'); //speaker
    native.activateInteriorEntitySet(interior, 'Int01_ba_equipment_upgrade'); //speaker

    native.activateInteriorEntitySet(interior, 'Int01_ba_Style_tecno');
    native.activateInteriorEntitySet(interior, 'int01_ba_stage');

    native.activateInteriorEntitySet(interior, 'Int01_ba_dj01');

    native.activateInteriorEntitySet(interior, 'Int01_ba_deliverytruck');
    native.activateInteriorEntitySet(interior, 'int01_ba_lights_screen');
    native.activateInteriorEntitySet(interior, 'Int01_ba_Screen');
    native.activateInteriorEntitySet(interior, 'Int01_ba_lightgrid_01');
    native.activateInteriorEntitySet(interior, 'Int01_ba_bar_content');
    native.activateInteriorEntitySet(interior, 'Int01_ba_booze_03');
    native.activateInteriorEntitySet(interior, 'Int01_ba_dry_ice');
    native.activateInteriorEntitySet(interior, 'Int01_ba_trad_lights');
    native.activateInteriorEntitySet(interior, 'Int01_ba_trophy11');
    native.activateInteriorEntitySet(interior, 'int01_ba_clutter');

    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 4; j++) {
        native.deactivateInteriorEntitySet(interior, `DJ_0${i}_Lights_0${j}`); //auf jeden Fall die laser
      }
    }
    native.deactivateInteriorEntitySet(interior, 'dj_04_lights_01');
    native.activateInteriorEntitySet(interior, 'dj_04_lights_02');
    native.deactivateInteriorEntitySet(interior, 'dj_04_lights_03');
    native.activateInteriorEntitySet(interior, 'dj_04_lights_04');

    const light = alt.Utils.getClosestWorldObject({ pos: new alt.Vector3(-1591.597, -3013.749, -77.40491), range: 0.5 });
    if (!light) return logDebug('No light found');
    native.forceRoomForEntity(light, interior, alt.hash('Int_01_main_area'));

    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_Bogs', false);
    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_Entry_Hall', false);
    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_Entry_Stairs', false);
    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_main_area_2', false);
    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_garage', false);
    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_main_area', false);
    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_office', false);
    native.setStaticEmitterEnabled('SE_ba_dlc_int_01_rear_L_corridor', false);

    native.refreshInterior(interior);
    break;
  }

  case 'music':
    {
      await alt.Utils.requestModel(alt.hash('ba_prop_battle_club_speaker_large'));
      const entity = alt.Utils.getClosestWorldObject({ pos: new alt.Vector3(-1588.69, -3013.09, -79.01), range: 3 });
      // const entity = native.getClosestObjectOfType(-1588.69, -3013.09, -79.01, 20.0, alt.hash('ba_prop_battle_club_speaker_large'), false, false, false);
      if (!entity) return logDebug('No entity found');
      const audio = new alt.Audio('https://ostseewelle-nord.cast.addradio.de/ostseewelle/nord/mp3/high.m3u', 1, true, true);
      const output = new alt.AudioOutputAttached(entity);
      audio.addOutput(output);
      audio.play();
    }
    break;