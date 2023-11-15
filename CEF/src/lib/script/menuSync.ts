import {
  animateDuration,
  currentIndex,
  currentTitle,
  displayedIndeces,
  maxDisplayedItems,
  maxIndex,
  menuSide,
  menuVisible,
  menuWidth,
  menuX,
  menuY,
  uiScale,
} from '$lib/store/menu';
import { get } from 'svelte/store';

export function registerMenuSync() {
  alt.on('menu:setMaxIndex', setMaxIndex);
  alt.on('menu:setCurrentIndex', setCurrentIndex);
  alt.on('menu:setTitle', setTitle);
  alt.on('menu:setVisibility', setVisibility);
  alt.on('menu:applySettings', applySettings);
}

function setVisibility(visible: boolean) {
  menuVisible.set(visible);
}

function setMaxIndex(index: number) {
  maxIndex.set(index);
}

function setTitle(title: string) {
  currentTitle.set(title);
}

function applySettings(side: 'left' | 'right', maxItems: number, posX: number, posY: number, width: number, scale: number) {
  maxDisplayedItems.set(maxItems);
  menuSide.set(side.toLowerCase() as never);
  menuX.set(posX);
  menuY.set(posY);
  menuWidth.set(width);
  uiScale.set(scale);
}

function setCurrentIndex(index: number, duration: number) {
  animateDuration.set(duration);
  currentIndex.set(index);
  const displayedItems = get(maxDisplayedItems);
  let dispStart = Math.max(0, index - Math.floor(displayedItems / 2));
  const dispEnd = Math.min(dispStart + displayedItems, get(maxIndex) + 1);
  dispStart = Math.max(0, dispEnd - displayedItems);
  const indeces = [];
  for (let i = dispStart; i < dispEnd; i++) {
    indeces.push(i);
  }
  displayedIndeces.set(indeces);
}
