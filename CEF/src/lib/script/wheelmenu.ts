import { writable } from 'svelte/store';

export const currentWheelMenu = writable<string[][]>([]);

export function registerWheelMenu() {
  alt.on('wheel:showMenu', showWheelMenu);
}

function showWheelMenu(newMenu: string[][]) {
  currentWheelMenu.set(newMenu);
}
