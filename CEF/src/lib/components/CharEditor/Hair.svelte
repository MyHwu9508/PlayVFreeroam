<script lang="ts">
  import CharColorPicker from './CharColorPicker.svelte';
  import { maleHair, femaleHair, eyebrowNames, facialHair, hairHex, chestHairNames } from './hairData';
  import { RangeSlider } from '@skeletonlabs/skeleton';
  import InputHeader from './InputHeader.svelte';
  import type { CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  export let data: CharEditorData;
  function getAdjustedHairIndex(index: number) {
    if (!data.female && index > 36) return index + 35;
    if (data.female && index > 38) return index + 37;
    return index;
  }

  function getAdjustedLength(index: number) {
    if (data.female) {
      if (index > 38) return femaleHair.length + 37;
      return femaleHair.length;
    }
    if (index > 36) return maleHair.length + 35;
    return maleHair.length;
  }
</script>

<div class="border-tertiary-500/50 rounded-container-token border p-1">
  <RangeSlider
    name="HairStyle"
    bind:value={data.hairIndex}
    min={0}
    max={(data.female ? femaleHair.length : maleHair.length) - 1}
    step={1}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label="Hair" subLabel={data.female ? femaleHair[data.hairIndex] : maleHair[data.hairIndex]} />
      <div class="text-xs font-thin">
        {getAdjustedHairIndex(data.hairIndex)} / {getAdjustedLength(data.hairIndex) - 1}
      </div>
    </div>
  </RangeSlider>
  <CharColorPicker colors={hairHex} bind:selectedID={data.hairColor.colorID} buttonLabel="Hair color" />
  <CharColorPicker
    colors={hairHex}
    bind:selectedID={data.hairColor.highlightColorID}
    buttonLabel="Hair highlight color"
  />
</div>
<div class="border-tertiary-500/50 rounded-container-token border p-1">
  <RangeSlider
    name="EyebrowStyle"
    bind:value={data.headOverlays[2].index}
    min={0}
    max={eyebrowNames.length - 1}
    step={1}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label="Exebrow" subLabel={eyebrowNames[data.headOverlays[2].index]} />
      <div class="text-xs font-thin">
        {data.headOverlays[2].index} / {eyebrowNames.length - 1}
      </div>
    </div>
  </RangeSlider>
  <RangeSlider
    name="EyebrowOpacity"
    bind:value={data.headOverlays[2].opacity}
    min={0}
    max={1}
    step={0.01}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label="Eyebrow opacity" />
      <div class="text-xs font-thin">
        {Math.floor(data.headOverlays[2].opacity * 100)}%
      </div>
    </div>
  </RangeSlider>
  <CharColorPicker colors={hairHex} bind:selectedID={data.headOverlays[2].colorID} buttonLabel="Eyebrow color" />
</div>
<div class="border-tertiary-500/50 rounded-container-token border p-1">
  <RangeSlider
    name="FacialHairStyle"
    bind:value={data.headOverlays[1].index}
    min={0}
    max={facialHair.length - 1}
    step={1}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label="Facial hair" subLabel={facialHair[data.headOverlays[1].index]} />
      <div class="text-xs font-thin">
        {data.headOverlays[1].index} / {facialHair.length - 1}
      </div>
    </div>
  </RangeSlider>
  <RangeSlider
    name="FacialHairOpacity"
    bind:value={data.headOverlays[1].opacity}
    min={0}
    max={1}
    step={0.01}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label="Facial hair opacity" />
      <div class="text-xs font-thin">
        {Math.floor(data.headOverlays[1].opacity * 100)}%
      </div>
    </div>
  </RangeSlider>
  <CharColorPicker colors={hairHex} bind:selectedID={data.headOverlays[1].colorID} buttonLabel="Facial hair color" />
</div>
<div class="border-tertiary-500/50 rounded-container-token border p-1">
  <RangeSlider
    name="ChestHairStyle"
    bind:value={data.headOverlays[10].index}
    min={0}
    max={16}
    step={1}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label="Chest hair" subLabel={chestHairNames[data.headOverlays[10].index]} />
      <div class="text-xs font-thin">
        {data.headOverlays[10].index} / 16
      </div>
    </div>
  </RangeSlider>
  <RangeSlider
    name="ChestHairOpacity"
    bind:value={data.headOverlays[10].opacity}
    min={0}
    max={1}
    step={0.01}
    accent="!accent-primary-500"
  >
    <div class="flex items-center justify-between">
      <InputHeader label="Chest hair opacity" />
      <div class="text-xs font-thin">
        {Math.floor(data.headOverlays[10].opacity * 100)}%
      </div>
    </div>
  </RangeSlider>
  <CharColorPicker colors={hairHex} bind:selectedID={data.headOverlays[10].colorID} buttonLabel="Chest hair color" />
</div>
