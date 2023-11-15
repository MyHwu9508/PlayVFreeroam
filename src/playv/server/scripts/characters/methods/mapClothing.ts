import alt from 'alt-server';
import fs from 'fs-extra';
import dlcMax from '../../../../../../data/clothes.json'

function startMapping(gender: string) {
  
}

export async function mapClothing(player: alt.Player) {
  player.model = alt.hash('mp_m_freemode_01');
  player.model = alt.hash('mp_f_freemode_01');
  alt.log('Done');
}
