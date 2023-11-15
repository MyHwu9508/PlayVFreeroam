<script lang="ts">
  import { RangeSlider } from '@skeletonlabs/skeleton';
  import FACE_NAMES from './faceNames';
  import InputHeader from './InputHeader.svelte';
  import type { CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  export let data: CharEditorData;
</script>

<RangeSlider name="shapeFirst" bind:value={data.headBlendData.shapeFirst} max={45} ticked accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Shape mother" subLabel={FACE_NAMES[data.headBlendData.shapeFirst]} />
    <div class="text-xs font-thin">{data.headBlendData.shapeFirst} / 45</div>
  </div>
</RangeSlider>
<RangeSlider name="skinFirst" bind:value={data.headBlendData.skinFirst} max={45} ticked accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Skin mother" subLabel={FACE_NAMES[data.headBlendData.skinFirst]} />
    <div class="text-xs font-thin">{data.headBlendData.skinFirst} / 45</div>
  </div>
</RangeSlider>
<RangeSlider
  name="shapeSecond"
  bind:value={data.headBlendData.shapeSecond}
  max={45}
  ticked
  accent="!accent-primary-500"
>
  <div class="flex items-center justify-between">
    <InputHeader label="Shape father" subLabel={FACE_NAMES[data.headBlendData.shapeSecond]} />
    <div class="text-xs font-thin">{data.headBlendData.shapeSecond} / 45</div>
  </div>
</RangeSlider>
<RangeSlider name="skinSecond" bind:value={data.headBlendData.skinSecond} max={45} ticked accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Skin father" subLabel={FACE_NAMES[data.headBlendData.skinSecond]} />
    <div class="text-xs font-thin">{data.headBlendData.skinSecond} / 45</div>
  </div>
</RangeSlider>
<RangeSlider name="shapeMix" bind:value={data.headBlendData.shapeMix} max={1} step={0.01} accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Shape mix" />
    <div class="text-xs font-thin">{Math.floor(data.headBlendData.shapeMix * 100)}%</div>
  </div>
</RangeSlider>
<RangeSlider name="skinMix" bind:value={data.headBlendData.skinMix} max={1} step={0.01} accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Skin mix" />
    <div class="text-xs font-thin">{Math.floor(data.headBlendData.skinMix * 100)}%</div>
  </div>
</RangeSlider>
<RangeSlider name="shapeThird" bind:value={data.headBlendData.shapeThird} max={45} ticked accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Shape override" subLabel={FACE_NAMES[data.headBlendData.shapeThird]} />
    <div class="text-xs font-thin">{data.headBlendData.shapeThird} / 45</div>
  </div>
</RangeSlider>
<RangeSlider name="skinThird" bind:value={data.headBlendData.skinThird} max={45} ticked accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Skin override" subLabel={FACE_NAMES[data.headBlendData.skinThird]} />
    <div class="text-xs font-thin">{data.headBlendData.skinThird} / 45</div>
  </div>
</RangeSlider>
<RangeSlider name="thirdMix" bind:value={data.headBlendData.thirdMix} max={1} step={0.01} accent="!accent-primary-500">
  <div class="flex items-center justify-between">
    <InputHeader label="Override mix" />
    <div class="text-xs font-thin">{Math.floor(data.headBlendData.thirdMix * 100)}%</div>
  </div>
</RangeSlider>
