import { writable } from 'svelte/store';

export const currentTitle = writable('Title');
export const maxIndex = writable(300);
export const currentIndex = writable(0);
export const currentComponentID = writable('');
export const maxDisplayedItems = writable(16);
export const displayedIndeces = writable<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
export const animateDuration = writable(300);
export const minHeight = writable(0);

export const menuSide = writable<'left' | 'right'>('left');
export const menuX = writable(0);
export const menuY = writable(0);
export const menuWidth = writable(20);
export const uiScale = writable(1);
export const menuVisible = writable(false);
