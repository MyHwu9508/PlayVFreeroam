import { LocalStorage } from '../../systems/localStorage';
import { webView } from '../view/webView';

export function registerSound() {
  webView.emit('sound:volume', LocalStorage.get('soundsVolume'));
}

export function playSound(soundName: string) {
  webView.emit('sound:play', soundName);
}

export function changeVolume(newVolume: number) {
  webView.emit('sound:volume', newVolume);
  LocalStorage.set('soundsVolume', newVolume);
  webView.emit('sound:play', 'hitmarker');
}
