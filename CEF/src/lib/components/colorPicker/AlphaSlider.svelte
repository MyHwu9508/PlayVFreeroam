<script lang="ts">
  import ColorIndicator from './ColorIndicator.svelte';
  import { colord } from 'colord';
  import { keyPressed, keyPressedCustom } from './utils/store';
  import { easeInOutSin } from './utils/transition';
  import type { ColorHSVA } from './types';

  export let hsva: ColorHSVA;
  export let toRight = true;

  let alpha: HTMLDivElement;
  let isMouseDown = false;

  let focused = false;

  let focusMovementIntervalId: number | undefined;
  let focusMovementCounter: number;
  let pos: number;

  function onClick(pos: number): void {
    const size = toRight ? alpha.getBoundingClientRect().width : alpha.getBoundingClientRect().height;
    const boundedPos = Math.max(0, Math.min(size, pos));
    hsva.a = boundedPos / size;
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
      onClick(toRight ? e.clientX - alpha.getBoundingClientRect().left : e.clientY - alpha.getBoundingClientRect().top);
  }

  function keyup(e: KeyboardEvent) {
    if (e.key === 'Tab') focused = !!document.activeElement?.isSameNode(alpha);
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
          hsva.a = Math.min(1, Math.max(0, hsva.a + movement * focusMovementFactor));
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
        ? e.changedTouches[0].clientX - alpha.getBoundingClientRect().left
        : e.changedTouches[0].clientY - alpha.getBoundingClientRect().top
    );
  }

  $: if (typeof hsva.a === 'number' && alpha) pos = 100 * hsva.a;
</script>

<svelte:window on:mouseup={mouseUp} on:mousemove={mouseMove} on:keyup={keyup} on:keydown={keydown} />

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="alpha rounded-token h-8 w-full select-none outline-none"
  tabindex="0"
  class:to-right={toRight}
  style="--alpha-color: {colord(hsva).toHex().substring(0, 7)}"
  bind:this={alpha}
  on:mousedown|preventDefault={mouseDown}
  on:touchstart={touch}
  on:touchmove|preventDefault={touch}
  on:touchend={touch}
  aria-label="transparency picker (arrow keyboard navigation)"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={Math.round(pos)}
  aria-valuetext="{pos?.toFixed()}%"
>
  <ColorIndicator
    pos={{ x: toRight ? pos : 50, y: toRight ? 50 : pos }}
    hex={colord(hsva).toHex()}
    size="1rem"
    switchBorderColor
    container={alpha}
  />
</div>

<style>
  .alpha:after {
    @apply rounded-token;
    position: absolute;
    content: '';
    inset: 0;
    background: linear-gradient(#00000000, var(--alpha-color));
    z-index: 0;
  }
  .to-right:after {
    background: linear-gradient(0.25turn, #00000000, var(--alpha-color));
  }
  .alpha {
    position: relative;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%),
      linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
    background-size: var(--pattern-size-2x, 12px) var(--pattern-size-2x, 12px);
    background-position: 0 0, var(--pattern-size, 6px) var(--pattern-size, 6px);
  }
</style>
