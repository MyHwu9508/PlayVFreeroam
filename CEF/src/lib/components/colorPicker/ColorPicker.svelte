<script lang="ts">
  import HueSlider from './HueSlider.svelte';
  import { colord } from 'colord';
  import AlphaSlider from './AlphaSlider.svelte';
  import ColorBox from './ColorBox.svelte';
  import ColorTextInput from './ColorTextInput.svelte';
  import type { ColorHSVA } from './types';
  import { createEventDispatcher } from 'svelte';

  export let value: string;
  export let boxHeight = '100%';
  export let alpha = true;
  let hsva: ColorHSVA = colord(value).toHsv();

  $: updateValue(hsva);
  const dispatch = createEventDispatcher();

  function updateValue(hsva: ColorHSVA) {
    value = colord(hsva).toHex();
    dispatch('input', value);
  }
</script>

<div class="flex flex-col gap-1 h-full">
  <div class="w-full" style="height: {boxHeight};">
    <ColorBox bind:hsva />
  </div>
  <HueSlider bind:hsva />
  {#if alpha}
    <AlphaSlider bind:hsva />
  {/if}
  <ColorTextInput bind:hsva {alpha} />
</div>
