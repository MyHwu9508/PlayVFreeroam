<script lang="ts">
  import EyeColorSelector from './EyeColorSelector.svelte';
  import InputHeader from './InputHeader.svelte';
  import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
  import { tick, onMount } from 'svelte';
  import type { CharEditorMetaData, CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  export let data: CharEditorData;
  export let metaData: CharEditorMetaData;
  let nameInput: HTMLInputElement;

  onMount(async () => {
    await tick();
    nameInput?.focus();
  });
</script>

<div class="py-24">
  <div>
    <InputHeader label="Name" />
    <input
      type="text"
      bind:this={nameInput}
      bind:value={metaData.profileName}
      class="input text-base"
      maxlength="20"
      placeholder="Name"
    />
  </div>
  <div>
    <InputHeader label="Sex" subLabel={data.female ? 'Female' : 'Male'} />
    <RadioGroup display="flex justify-between" active="variant-filled-primary" hover="hover:variant-soft-primary">
      <RadioItem padding="px-4 py-1 !w-56" name="maleSelect" bind:group={data.female} value={false}>Male</RadioItem>
      <RadioItem padding="px-4 py-1 !w-56" name="femaleSelect" bind:group={data.female} value={true}>Female</RadioItem>
    </RadioGroup>
  </div>
  <EyeColorSelector bind:value={data.eyeColor} />
  <p class="mt-3 text-center text-sm text-gray-400">
    You can use keyboard inputs to fine tune any slider. Use Tab to switch between items and arrow keys or Space/Enter
    to make inputs on them.
  </p>
  <p class="mt-0.5 text-center text-sm text-gray-400">
    The right side is dedicated to the Camera, you can rotate the camera and zoom in/out (also using scroll wheel). The
    slider on the right edge of the screen allows you to move your camrera up and down. Dragging in the middle allows
    you to move the direction your character is looking.
  </p>
</div>
