<script lang="ts">
  import { RangeSlider } from '@skeletonlabs/skeleton';
  import InputHeader from './InputHeader.svelte';
  export let overlayMaxIndece: number[];
  import type { CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  export let data: CharEditorData;

  const SKIN_OVERLAYS = [
    {
      index: 0,
      labelIndex: 'Blemishes',
      labelOpacity: 'Blemishes opacity',
      max: overlayMaxIndece[0],
    },
    {
      index: 11,
      labelIndex: 'Body blemeshes',
      labelOpacity: 'Body blemeshes opacity',
      max: overlayMaxIndece[11],
    },
    {
      index: 3,
      labelIndex: 'Ageing',
      labelOpacity: 'Ageing opacity',
      max: overlayMaxIndece[3],
    },
    {
      index: 6,
      labelIndex: 'Complexion',
      labelOpacity: 'Complexion opacity',
      max: overlayMaxIndece[6],
    },
    {
      index: 7,
      labelIndex: 'Sun damage',
      labelOpacity: 'Sun damage opacity',
      max: overlayMaxIndece[7],
    },
    {
      index: 9,
      labelIndex: 'Freckles',
      labelOpacity: 'Freckles opacity',
      max: overlayMaxIndece[9],
    },
  ];
</script>

{#each SKIN_OVERLAYS as { index, labelIndex, labelOpacity, max }}
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
          {data.headOverlays[index].index} / {max}
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
  </div>
{/each}
