<script lang="ts">
  import { RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
  import InputHeader from './InputHeader.svelte';
  import CharColorPicker from './CharColorPicker.svelte';
  import { makeupHex } from './hairData';
  import type { CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  export let data: CharEditorData;
  export let overlayMaxIndece: number[];

  const MAKEUP_OVERLAYS = [
    {
      index: 4,
      labelIndex: 'Makeup',
      labelOpacity: 'Makeup opacity',
      labelColor: 'Makeup color',
      max: overlayMaxIndece[4],
    },
    {
      index: 5,
      labelIndex: 'Blush',
      labelOpacity: 'Blush opacity',
      labelColor: 'Blush color',
      max: overlayMaxIndece[5],
    },
    {
      index: 8,
      labelIndex: 'Lipstick',
      labelOpacity: 'Lipstick opacity',
      labelColor: 'Lipstick color',
      max: overlayMaxIndece[8],
    },
  ];
</script>

{#each MAKEUP_OVERLAYS as { index, labelIndex, labelOpacity, labelColor, max }}
  <div class="border-tertiary-500/50 rounded-container-token border p-1">
    <RangeSlider
      name={labelIndex}
      bind:value={data.headOverlays[index].index}
      min={0}
      {max}
      step={1}
      accent="!accent-primary-500"
      ticked
    >
      <div class="flex items-center justify-between">
        <InputHeader label={labelIndex} />
        <div class="text-xs font-thin">
          {data.headOverlays[index].index + 1} / {max + 1}
        </div>
      </div>
    </RangeSlider>
    <RangeSlider
      name={labelOpacity}
      bind:value={data.headOverlays[index].opacity}
      min={0}
      max={1}
      step={0.01}
      accent="!accent-primary-500"
    >
      <div class="flex items-center justify-between">
        <InputHeader label={labelOpacity} />
        <div class="text-xs font-thin">
          {Math.floor(data.headOverlays[index].opacity * 100)}%
        </div>
      </div>
    </RangeSlider>
    {#if index === 4}
      <div class="flex items-center justify-between pb-3">
        <span class="text-2xl">Override makeup color:</span>
        <SlideToggle name="makeupOverrideColor" bind:checked={data.overrideMakeupColor} active="bg-primary-500" />
      </div>
    {/if}
    <CharColorPicker colors={makeupHex} bind:selectedID={data.headOverlays[index].colorID} buttonLabel={labelColor} />
    {#if index === 4}
      <CharColorPicker
        colors={makeupHex}
        bind:selectedID={data.headOverlays[index].secondColorID}
        buttonLabel="Secondary makeup color"
      />
    {/if}
  </div>
{/each}
