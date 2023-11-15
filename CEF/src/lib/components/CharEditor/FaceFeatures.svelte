<script lang="ts">
  import { RangeSlider } from '@skeletonlabs/skeleton';
  import InputHeader from './InputHeader.svelte';
  import type { CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  export let data: CharEditorData;
  const FACE_FEATURES = [
    'Nose width',
    'Nose height',
    'Nose length',
    'Nose bridge',
    'Nose tip',
    'Nose bridge shift',
    'Brow height',
    'Brow width',
    'Cheekbone height',
    'Cheekbone width',
    'Cheek width',
    'Eyes',
    'Lips',
    'Jaw width',
    'Jaw height',
    'Chin length',
    'Chin position',
    'Chin width',
    'Chin shape',
    'Neck width',
  ];
</script>

{#each FACE_FEATURES as feature, i}
  <RangeSlider
    name={feature}
    bind:value={data.faceFeature[i]}
    min={-1}
    max={1}
    step={0.01}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label={feature} />
      <div class="text-xs font-thin">{Math.floor(data.faceFeature[i] * 100)}%</div>
    </div>
  </RangeSlider>
{/each}
