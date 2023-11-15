import { Howl } from 'howler';

const soundEffects = {
  success: new Howl({
    src: ['audio/confirmation_003.ogg'],
  }),
  error: new Howl({
    src: ['audio/error_003.ogg'],
  }),
  information: new Howl({
    src: ['audio/question_003.ogg'],
  }),
  warning: new Howl({
    src: ['audio/question_004.ogg'],
  }),
  hitsoundregular: new Howl({
    src: ['audio/hitsound_regular.mp3'],
  }),
  hitsoundheadshot: new Howl({
    src: ['audio/hitsound_headshot.mp3'],
  }),
};

setVolume(0.05); //default volume

export function registerSound() {
  alt.on('sound:play', playSound);
  alt.on('sound:volume', setVolume);
}

export function playSound(sound: keyof typeof soundEffects) {
  soundEffects[sound].play();
}

function setVolume(volume: number) {
  for (const sound of Object.values(soundEffects)) {
    sound.volume(volume);
  }
}
