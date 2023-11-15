<script lang="ts">
  import { colord } from 'colord';
  import { keyPressed, keyPressedCustom } from './utils/store';
  import { easeInOutSin } from './utils/transition';
  import ColorIndicator from './ColorIndicator.svelte';
  import type { ColorHSVA } from './types';

  export let hsva: ColorHSVA;

  let picker: HTMLDivElement;
  let isMouseDown = false;
  let focused = false;

  let focusMovementIntervalId: number | undefined;
  let focusMovementCounter: number;

  let colorBg: string;
  let pos = { x: 100, y: 0 };

  $: if (typeof hsva.h === 'number') colorBg = colord({ h: hsva.h, s: 100, v: 100, a: 1 }).toHex();

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(min, value), max);
  }

  function onClick(e: { offsetX: number; offsetY: number }) {
    let mouse = { x: e.offsetX, y: e.offsetY };
    let width = picker.getBoundingClientRect().width;
    let height = picker.getBoundingClientRect().height;
    hsva.s = clamp(mouse.x / width, 0, 1) * 100;
    hsva.v = clamp((height - mouse.y) / height, 0, 1) * 100;
  }

  function pickerMousedown(e: MouseEvent) {
    if (e.button === 0) {
      isMouseDown = true;
      onClick(e);
    }
  }

  function mouseUp() {
    isMouseDown = false;
  }

  function mouseMove(e: MouseEvent) {
    if (isMouseDown)
      onClick({
        offsetX: Math.max(
          0,
          Math.min(picker.getBoundingClientRect().width, e.clientX - picker.getBoundingClientRect().left)
        ),
        offsetY: Math.max(
          0,
          Math.min(picker.getBoundingClientRect().height, e.clientY - picker.getBoundingClientRect().top)
        ),
      });
  }

  function mouseDown(e: MouseEvent) {
    if (!(<HTMLElement>e.target).isSameNode(picker)) focused = false;
  }

  function keyup(e: KeyboardEvent) {
    if (e.key === 'Tab') focused = !!document.activeElement?.isSameNode(picker);

    if (!e.repeat && focused) move();
  }

  function keydown(e: KeyboardEvent) {
    if (focused && $keyPressedCustom.ArrowVH) {
      e.preventDefault();
      if (!e.repeat) move();
    }
  }

  function move() {
    if ($keyPressedCustom.ArrowVH) {
      if (!focusMovementIntervalId) {
        focusMovementCounter = 0;
        focusMovementIntervalId = window.setInterval(() => {
          let focusMovementFactor = easeInOutSin(++focusMovementCounter);
          hsva.s = Math.min(
            100,
            Math.max(0, hsva.s + ($keyPressed.ArrowRight - $keyPressed.ArrowLeft) * focusMovementFactor * 100)
          );
          hsva.v = Math.min(
            100,
            Math.max(0, hsva.v + ($keyPressed.ArrowUp - $keyPressed.ArrowDown) * focusMovementFactor * 100)
          );
        }, 10);
      }
    } else if (focusMovementIntervalId) {
      clearInterval(focusMovementIntervalId);
      focusMovementIntervalId = undefined;
    }
  }

  function touch(e: TouchEvent) {
    e.preventDefault();
    onClick({
      offsetX: e.changedTouches[0].clientX - picker.getBoundingClientRect().left,
      offsetY: e.changedTouches[0].clientY - picker.getBoundingClientRect().top,
    });
  }

  $: if (typeof hsva.s === 'number' && typeof hsva.v === 'number' && picker)
    pos = {
      x: hsva.s,
      y: 100 - hsva.v,
    };
</script>

<svelte:window
  on:mouseup={mouseUp}
  on:mousedown={mouseDown}
  on:mousemove={mouseMove}
  on:keyup={keyup}
  on:keydown={keydown}
/>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="rounded-container-token relative h-full w-full"
  tabindex="0"
  bind:this={picker}
  on:mousedown|preventDefault={pickerMousedown}
  on:touchstart={touch}
  on:touchmove|preventDefault={touch}
  on:touchend={touch}
  style="background: linear-gradient(#ffffff00, #000000ff),
    linear-gradient(0.25turn, #ffffffff, #00000000), {colorBg};"
>
  <ColorIndicator hex={colord(hsva).alpha(1).toHex()} switchBorderColor {pos} container={picker} />
</div>
