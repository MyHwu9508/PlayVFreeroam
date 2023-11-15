<script lang="ts">
  import { RangeSlider, getModalStore } from '@skeletonlabs/skeleton';
  import InputHeader from './InputHeader.svelte';
  let value = 0;
  const modalStore = getModalStore();

  $: alt.emit('charCreator:mask', value);
</script>

<div class="card grid w-[30vw] p-4">
  <RangeSlider name="MaskSlider" min={0} max={215} bind:value
    ><InputHeader label="Mask" subLabel="{value} / 215" /></RangeSlider
  >
  <button class="btn variant-filled-primary justify-self-end" on:click={() => modalStore.close()}>Ok</button>
</div>
