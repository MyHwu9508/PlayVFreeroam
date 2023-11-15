<script lang="ts">
  import { colord } from 'colord';
  import type { ColorHSVA } from './types';

  let mode = 0;
  let COLOR_MODES = ['HEX', 'RGB', 'HSV'];

  export let hsva: ColorHSVA;
  export let alpha = true;
  let _hsva: ColorHSVA;
  let _rgba: { r: number; g: number; b: number; a: number };
  let _hex: string;
  let isValidHex = true;
  let container: HTMLDivElement | undefined;

  $: updateValues(hsva);
  $: inputHex(_hex);
  $: inputRGB(_rgba);
  $: inputHSV(_hsva);

  function updateValues(hsva: ColorHSVA) {
    if (!container || container.contains(document.activeElement)) return;
    _hex = colord(hsva).toHex();
    _hsva = colord(_hex).toHsv();
    _rgba = colord(_hex).toRgb();
  }

  function inputHex(hex: string) {
    if (!hex) return;
    const isValidHexString = /^#?([a-fA-F0-9]{3,4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$/g.test(hex);
    isValidHex = isValidHexString;
    if (isValidHex && hex.length > 7 && !alpha) isValidHex = false;
    if (!isValidHexString) return;
    hsva = colord(hex).toHsv();
  }
  function inputRGB(rgb: { r: number; g: number; b: number; a: number }) {
    if (!rgb) return;
    const isValidRGBA =
      rgb.r !== null &&
      rgb.r >= 0 &&
      rgb.r <= 255 &&
      rgb.g !== null &&
      rgb.g >= 0 &&
      rgb.g <= 255 &&
      rgb.b !== null &&
      rgb.b >= 0 &&
      rgb.b <= 255 &&
      rgb.a !== null &&
      rgb.a >= 0 &&
      rgb.a <= 1;
    if (!isValidRGBA) return;
    hsva = colord(rgb).toHsv();
  }
  function inputHSV(hsv: ColorHSVA) {
    if (!hsv) return;
    const isValidHSVA =
      hsv.h !== null &&
      hsv.h >= 0 &&
      hsv.h <= 360 &&
      hsv.s !== null &&
      hsv.s >= 0 &&
      hsv.s <= 100 &&
      hsv.v !== null &&
      hsv.v >= 0 &&
      hsv.v <= 100 &&
      hsv.a !== null &&
      hsv.a >= 0 &&
      hsv.a <= 1;
    if (!isValidHSVA) return;
    hsva = hsv;
  }

  function nextMode() {
    mode = (mode + 1) % COLOR_MODES.length;
  }

  function mouseDown(e: MouseEvent) {
    if (container?.contains(e.target as Node)) return;
    if (container?.contains(document.activeElement)) {
      (document?.activeElement as HTMLElement)?.blur();
    }
  }
</script>

<svelte:window on:mousedown={mouseDown} />
<div bind:this={container} class="flex items-center gap-1">
  {#if COLOR_MODES[mode] === 'RGB'}
    <label class="label" for="red-input">R:</label>
    <input class="input !p-1" type="number" min="0" max="255" bind:value={_rgba.r} id="red-input" />
    <label class="label" for="blue-input">G:</label>
    <input class="input !p-1" type="number" min="0" max="255" bind:value={_rgba.g} id="blue-input" />
    <label class="label" for="green-input">B:</label>
    <input class="input !p-1" type="number" min="0" max="255" bind:value={_rgba.b} id="green-input" />
    {#if alpha}
      <label class="label" for="alpha-input">A:</label>
      <input class="input !p-1" type="number" min="0" max="1" step="0.01" bind:value={_rgba.a} id="alpha-input" />
    {/if}
  {:else if COLOR_MODES[mode] === 'HEX'}
    <label class="label" for="hex-input">HEX:</label>
    <input class="input {isValidHex ? '' : 'input-error'}" type="text" bind:value={_hex} id="hex-input" />
  {:else if COLOR_MODES[mode] === 'HSV'}
    <label class="label" for="h-input">H:</label>
    <input class="input !p-1" type="number" min="0" max="360" bind:value={_hsva.h} id="h-input" />
    <label class="label" for="s-input">S:</label>
    <input class="input !p-1" type="number" min="0" max="100" bind:value={_hsva.s} id="s-input" />
    <label class="label" for="v-input">V:</label>
    <input class="input !p-1" type="number" min="0" max="100" bind:value={_hsva.v} id="v-input" />
    {#if alpha}
      <label class="label" for="alpha-input">A:</label>
      <input class="input" type="number" min="0" max="1" bind:value={_hsva.a} step="0.01" id="alpha-input" />
    {/if}
  {/if}
  <button
    class="btn variant-ghost-primary w-16"
    style="height: {container?.getBoundingClientRect().height ?? 16}px"
    on:click={nextMode}>{COLOR_MODES[mode]}</button
  >
</div>
