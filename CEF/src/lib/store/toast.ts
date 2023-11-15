import { writable } from 'svelte/store';
import { UUID } from 'uuidjs';
import { playSound } from '../script/soundFX';
import type { Toast } from '../../types/toast';

export const toasts = writable<Map<string, Toast>>(new Map());

export function registerToastStore() {
  alt.on('toast:add', addToast);
}

function addToast(variant: Toast['variant'], text: Toast['text'], title?: Toast['title']) {
  toasts.update(toastys => {
    const id = UUID.genV4().toString();
    toastys.set(id, { variant, text, title });
    playSound(variant);

    setTimeout(() => {
      toasts.update(toastys => {
        toastys.delete(id);
        return toastys;
      });
    }, getToastTimeout({ variant, text, title }));
    return toastys;
  });
}

function getToastTimeout(toast: Toast) {
  let minTimeout = 4000;
  switch (toast.variant) {
    case 'error':
      minTimeout = 7000;
      break;
    case 'warning':
      minTimeout = 5000;
      break;
  }

  return minTimeout + toast.text.length * 30;
}
