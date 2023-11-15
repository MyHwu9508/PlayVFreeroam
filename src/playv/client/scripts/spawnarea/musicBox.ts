import alt from 'alt-client';
import native from 'natives';
import { setFloatingButtons } from '../../ui/hud/floatingKeybinds';
import { pushToast } from '../../ui/hud/toasts';

let audioBox1: alt.Object;
let audioBox2: alt.Object;
// const audio = new alt.Audio('@assets/music/cypis.mp3', 1, false, true);
const audioColshape = new alt.ColshapeSphere(-857.2635498046875, -1286.810546875, 16.89995002746582, 10);
audioColshape.dimension = -2147483648;

let audio: alt.Audio;

export function createMusicbox() {
  if (alt.isInStreamerMode()) return; //nono for streamers
  audioBox1 = new alt.LocalObject(
    alt.hash('h4_prop_battle_club_speaker_large'),
    new alt.Vector3(-854.234375, -1290.56005859375, 16.89995002746582),
    new alt.Vector3(0, 0, 242.75299072265625 * (Math.PI / 180)),
    true,
    false,
    true,
    10
  );
  audioBox2 = new alt.LocalObject(
    alt.hash('h4_prop_battle_club_speaker_large'),
    new alt.Vector3(-857.352783203125, -1282.1060791015625, 16.899948120117188),
    new alt.Vector3(0, 0, 331.9530334472656 * (Math.PI / 180)),
    true,
    false,
    true,
    10
  );
  audioBox1.dimension = -2147483648;
  audioBox2.dimension = -2147483648;
}

alt.on('gameEntityCreate', entity => {
  if (entity === audioBox1 || entity === audioBox2) {
    native.freezeEntityPosition(entity, true);
    native.placeObjectOnGroundProperly(entity.scriptID);
  }
});

alt.on('entityEnterColshape', async colshape => {
  if (colshape !== audioColshape) return;
  audio = new alt.Audio('http://localhost:8080', 1, true, true); //Enter remote radio URL here
  audio.play();
  await alt.Utils.waitFor(() => audioBox1?.scriptID !== undefined && audioBox2?.scriptID !== undefined, 10000).catch(e => {
    logDebug(`ERROR SYNC AUDIO` + e);
  });
  audio.addOutput(new alt.AudioOutputAttached(audioBox1));
  audio.addOutput(new alt.AudioOutputAttached(audioBox2));
  pushToast('information', 'To adjust the volume of the music, change the audio volume in your GTA settings (ESC key)');
});

alt.on('entityLeaveColshape', colshape => {
  if (colshape !== audioColshape) return;
  audio.destroy(); //found obj
});
