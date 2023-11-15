<script lang="ts">
  import InputHeader from './InputHeader.svelte';
  let selectorHeight = 0;
  export let value: number;
  let visible = false;

  function selectEyeColor(selected: number) {
    value = selected;
    visible = !visible;
  }
</script>

<InputHeader label="Eye Color" subLabel={value + 1} />
<div class="relative py-1">
  <button class="btn variant-filled-primary w-full" on:click={() => (visible = !visible)}>Select Eye Color</button>
  {#if visible}
    <div class="absolute flex w-full justify-center" style="top: -{selectorHeight + 5}px">
      <div class="card !bg-secondary-900/60 w-[23.2rem] p-4" bind:clientHeight={selectorHeight}>
        {#each Array(32) as _, i}
          <button
            on:click={() => selectEyeColor(i)}
            class="btn-icon bg m-0.5"
            style="background-position: {(95.5 / 7) * (i % 8) + 2.25}% 
            {(90 / 3) * Math.floor(i / 8) + 5}%;"
          />
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .bg {
    background-image: url('/img/mp_eye_colour.png');
    background-size: 1200% 600%;
  }
</style>
