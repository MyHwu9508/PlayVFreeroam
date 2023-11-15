import native from 'natives';
import alt from 'alt-client';
import { LocalStorage } from '../../systems/localStorage';

export interface ModdedContents {
  [key: string]: {
    Creator: string;
    URL: string;
    Description: string;
    IPLs: string[];
  };
}
export const moddedContent: ModdedContents = JSON.parse(alt.File.read('@assets/moddedContent.json'));

//extendes the alt:V default IPLs with ours (cayo perico, etc)
export function loadDefaultIPLs() {
  alt.loadDefaultIpls(); //Load this always first, because alternative:V removes cayo

  //Casino doors Eingang
  alt.requestIpl('vw_dlc_casino_door');
  alt.requestIpl('hei_dlc_casino_door');

  //Kackyo Perico

  alt.requestIpl('h4_islandairstrip');
  alt.requestIpl('h4_islandairstrip_props');
  alt.requestIpl('h4_islandx_mansion');
  alt.requestIpl('h4_islandx_mansion_props');
  alt.requestIpl('h4_islandx_props');
  alt.requestIpl('h4_islandxdock');
  alt.requestIpl('h4_islandxdock_props');
  alt.requestIpl('h4_islandxdock_props_2');
  alt.requestIpl('h4_islandxtower');
  alt.requestIpl('h4_islandx_maindock');
  alt.requestIpl('h4_islandx_maindock_props');
  alt.requestIpl('h4_islandx_maindock_props_2');
  alt.requestIpl('h4_IslandX_Mansion_Vault');
  alt.requestIpl('h4_islandairstrip_propsb');
  alt.requestIpl('h4_beach');
  alt.requestIpl('h4_beach_props');
  alt.requestIpl('h4_beach_bar_props');
  alt.requestIpl('h4_islandx_barrack_props');
  alt.requestIpl('h4_islandx_checkpoint');
  alt.requestIpl('h4_islandx_checkpoint_props');
  alt.requestIpl('h4_islandx_Mansion_Office');
  alt.requestIpl('h4_islandx_Mansion_LockUp_01');
  alt.requestIpl('h4_islandx_Mansion_LockUp_02');
  alt.requestIpl('h4_islandx_Mansion_LockUp_03');
  alt.requestIpl('h4_islandairstrip_hangar_props');
  alt.requestIpl('h4_IslandX_Mansion_B');
  alt.requestIpl('h4_islandairstrip_doorsclosed');
  alt.requestIpl('h4_Underwater_Gate_Closed');
  alt.requestIpl('h4_mansion_gate_closed');
  alt.requestIpl('h4_aa_guns');
  alt.requestIpl('h4_IslandX_Mansion_GuardFence');
  alt.requestIpl('h4_IslandX_Mansion_Entrance_Fence');
  alt.requestIpl('h4_IslandX_Mansion_B_Side_Fence');
  alt.requestIpl('h4_IslandX_Mansion_Lights');
  alt.requestIpl('h4_islandxcanal_props');
  alt.requestIpl('h4_beach_props_party');
  alt.requestIpl('h4_islandX_Terrain_props_06_a');
  alt.requestIpl('h4_islandX_Terrain_props_06_b');
  alt.requestIpl('h4_islandX_Terrain_props_06_c');
  alt.requestIpl('h4_islandX_Terrain_props_05_a');
  alt.requestIpl('h4_islandX_Terrain_props_05_b');
  alt.requestIpl('h4_islandX_Terrain_props_05_c');
  alt.requestIpl('h4_islandX_Terrain_props_05_d');
  alt.requestIpl('h4_islandX_Terrain_props_05_e');
  alt.requestIpl('h4_islandX_Terrain_props_05_f');
  alt.requestIpl('H4_islandx_terrain_01');
  alt.requestIpl('H4_islandx_terrain_02');
  alt.requestIpl('H4_islandx_terrain_03');
  alt.requestIpl('H4_islandx_terrain_04');
  alt.requestIpl('H4_islandx_terrain_05');
  alt.requestIpl('H4_islandx_terrain_06');
  alt.requestIpl('h4_ne_ipl_00');
  alt.requestIpl('h4_ne_ipl_01');
  alt.requestIpl('h4_ne_ipl_02');
  alt.requestIpl('h4_ne_ipl_03');
  alt.requestIpl('h4_ne_ipl_04');
  alt.requestIpl('h4_ne_ipl_05');
  alt.requestIpl('h4_ne_ipl_06');
  alt.requestIpl('h4_ne_ipl_07');
  alt.requestIpl('h4_ne_ipl_08');
  alt.requestIpl('h4_ne_ipl_09');
  alt.requestIpl('h4_nw_ipl_00');
  alt.requestIpl('h4_nw_ipl_01');
  alt.requestIpl('h4_nw_ipl_02');
  alt.requestIpl('h4_nw_ipl_03');
  alt.requestIpl('h4_nw_ipl_04');
  alt.requestIpl('h4_nw_ipl_05');
  alt.requestIpl('h4_nw_ipl_06');
  alt.requestIpl('h4_nw_ipl_07');
  alt.requestIpl('h4_nw_ipl_08');
  alt.requestIpl('h4_nw_ipl_09');
  alt.requestIpl('h4_se_ipl_00');
  alt.requestIpl('h4_se_ipl_01');
  alt.requestIpl('h4_se_ipl_02');
  alt.requestIpl('h4_se_ipl_03');
  alt.requestIpl('h4_se_ipl_04');
  alt.requestIpl('h4_se_ipl_05');
  alt.requestIpl('h4_se_ipl_06');
  alt.requestIpl('h4_se_ipl_07');
  alt.requestIpl('h4_se_ipl_08');
  alt.requestIpl('h4_se_ipl_09');
  alt.requestIpl('h4_sw_ipl_00');
  alt.requestIpl('h4_sw_ipl_01');
  alt.requestIpl('h4_sw_ipl_02');
  alt.requestIpl('h4_sw_ipl_03');
  alt.requestIpl('h4_sw_ipl_04');
  alt.requestIpl('h4_sw_ipl_05');
  alt.requestIpl('h4_sw_ipl_06');
  alt.requestIpl('h4_sw_ipl_07');
  alt.requestIpl('h4_sw_ipl_08');
  alt.requestIpl('h4_sw_ipl_09');
  alt.requestIpl('h4_islandx_mansion');
  alt.requestIpl('h4_islandxtower_veg');
  alt.requestIpl('h4_islandx_sea_mines');
  alt.requestIpl('h4_islandx');
  alt.requestIpl('h4_islandx_barrack_hatch');
  alt.requestIpl('h4_islandxdock_water_hatch');
  alt.requestIpl('h4_beach_party');
  alt.requestIpl('h4_mph4_terrain_01_grass_0');
  alt.requestIpl('h4_mph4_terrain_01_grass_1');
  alt.requestIpl('h4_mph4_terrain_02_grass_0');
  alt.requestIpl('h4_mph4_terrain_02_grass_1');
  alt.requestIpl('h4_mph4_terrain_02_grass_2');
  alt.requestIpl('h4_mph4_terrain_02_grass_3');
  alt.requestIpl('h4_mph4_terrain_04_grass_0');
  alt.requestIpl('h4_mph4_terrain_04_grass_1');
  alt.requestIpl('h4_mph4_terrain_04_grass_2');
  alt.requestIpl('h4_mph4_terrain_04_grass_3');
  alt.requestIpl('h4_mph4_terrain_05_grass_0');
  alt.requestIpl('h4_mph4_terrain_06_grass_0');
  alt.requestIpl('h4_mph4_airstrip_interior_0_airstrip_hanger');

  for (const [name, content] of Object.entries(moddedContent)) {
    if (LocalStorage.get('activatedModdedContent').includes(name)) {
      for (const ipl of content.IPLs) {
        alt.requestIpl(ipl);
      }
    } else {
      for (const ipl of content.IPLs) {
        alt.removeIpl(ipl);
      }
    }
  }
}

//open some closed gates by default
export function initWorldObjectsAndDoors() {
  //military doors
  native.setLockedUnstreamedInDoorOfType(alt.hash('h4_prop_h4_gate_r_03a'), 4981.012, -5712.747, 20.78103, true, 0, 0, -10);
  native.setLockedUnstreamedInDoorOfType(alt.hash('h4_prop_h4_gate_l_03a'), 4984.134, -5709.249, 20.78103, true, 0, 0, 10);
  native.setLockedUnstreamedInDoorOfType(alt.hash('h4_prop_h4_gate_r_03a'), 4990.681, -5715.106, 20.78103, true, 0, 0, -10);
  native.setLockedUnstreamedInDoorOfType(alt.hash('h4_prop_h4_gate_l_03a'), 4987.587, -5718.635, 20.78103, true, 0, 0, 10);

  //water on boat near pier
  if (!alt.debug) native.createObject(alt.hash('apa_mp_apa_yacht_jacuzzi_ripple1'), -2023.98, -1037.89, 4.76, true, true, false);

  //who knows
  let interiorID = native.getInteriorAtCoords(1100.0, 220.0, -50.0);
  if (native.isValidInterior(interiorID)) {
    native.activateInteriorEntitySet(interiorID, '0x30240D11');
    native.activateInteriorEntitySet(interiorID, '0xA3C89BB2');
    native.refreshInterior(interiorID);
  }

  interiorID = native.getInteriorAtCoords(976.6364, 70.29476, 115.1641);
  if (native.isValidInterior(interiorID)) {
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Tint_Shell');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Pattern_09');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Spa_Bar_Open');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Media_Bar_Open');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Arcade_Modern');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Bar_Clutter');
    native.activateInteriorEntitySet(interiorID, 'Set_Pent_Clutter_03');
    native.activateInteriorEntitySet(interiorID, 'Set_pent_bar_light_02');
    native.refreshInterior(interiorID);
  }
}
