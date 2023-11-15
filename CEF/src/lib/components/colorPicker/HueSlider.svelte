<script lang="ts">
  import ColorIndicator from './ColorIndicator.svelte';
  import type { ColorHSVA } from './types';
  import { keyPressed, keyPressedCustom } from './utils/store';
  import { easeInOutSin } from './utils/transition';
  import { colord } from 'colord';
  export let toRight = true;
  export let hsva: ColorHSVA;

  let slider: HTMLDivElement;
  let isMouseDown = false;

  let pos = 0;

  let focused = false;

  let focusMovementIntervalId: number | undefined;
  let focusMovementCounter: number;

  function onClick(pos: number) {
    const size = toRight ? slider.getBoundingClientRect().width : slider.getBoundingClientRect().height;
    const boundedPos = Math.max(0, Math.min(size, pos));
    hsva.h = (boundedPos / size) * 360;
  }

  function mouseDown(e: MouseEvent) {
    if (e.button === 0) {
      isMouseDown = true;
      onClick(toRight ? e.offsetX : e.offsetY);
    }
  }

  function mouseUp() {
    isMouseDown = false;
  }

  function mouseMove(e: MouseEvent) {
    if (isMouseDown)
      onClick(
        toRight ? e.clientX - slider.getBoundingClientRect().left : e.clientY - slider.getBoundingClientRect().top
      );
  }

  function keyup(e: KeyboardEvent) {
    if (e.key === 'Tab') focused = !!document.activeElement?.isSameNode(slider);
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
          const focusMovementFactor = easeInOutSin(++focusMovementCounter);
          const movement = toRight
            ? $keyPressed.ArrowRight - $keyPressed.ArrowLeft
            : $keyPressed.ArrowDown - $keyPressed.ArrowUp;
          hsva.h = Math.min(360, Math.max(0, hsva.h + movement * 360 * focusMovementFactor));
        }, 10) as number;
      }
    } else if (focusMovementIntervalId) {
      clearInterval(focusMovementIntervalId);
      focusMovementIntervalId = undefined;
    }
  }

  function touch(e: TouchEvent) {
    e.preventDefault();
    onClick(
      toRight
        ? e.changedTouches[0].clientX - slider.getBoundingClientRect().left
        : e.changedTouches[0].clientY - slider.getBoundingClientRect().top
    );
  }

  $: if (typeof hsva.h === 'number' && slider) pos = (100 * hsva.h) / 360;
</script>

<svelte:window on:mouseup={mouseUp} on:mousemove={mouseMove} on:keyup={keyup} on:keydown={keydown} />

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="slider rounded-token h-8 w-full select-none outline-none"
  tabindex="0"
  class:to-right={toRight}
  bind:this={slider}
  on:mousedown|preventDefault={mouseDown}
  on:touchstart={touch}
  on:touchmove|preventDefault={touch}
  on:touchend={touch}
  aria-label="hue picker (arrow keyboard navigation)"
  aria-valuemin={0}
  aria-valuemax={360}
  aria-valuenow={Math.round(hsva.h)}
>
  <ColorIndicator
    pos={{ x: toRight ? pos : 50, y: toRight ? 50 : pos }}
    hex={colord({ h: hsva.h, s: 100, v: 100, a: 1 }).toHex()}
    size="1rem"
    container={slider}
  />
</div>

<style>
  .slider {
    --gradient: #ff0000, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%, #0000ff 67.7%,
      #ff00ff 83.3%, #ff0000;
    background: linear-gradient(var(--gradient));
  }
  .to-right {
    background: linear-gradient(0.25turn, var(--gradient));
  }
</style>
