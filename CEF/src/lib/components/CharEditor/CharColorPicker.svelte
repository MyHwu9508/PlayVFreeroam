<script lang="ts">
  export let colors: string[];
  export let selectedID: number;
  export let buttonLabel: string;
  let visible = false;
  let container: HTMLDivElement;
  let overlayHeight: number;

  function selectID(id: number) {
    selectedID = id;
    visible = false;
  }

  function clickOutsideHandler() {
    setTimeout(() => (visible = false), 10);
  }
</script>

<div class="relative" bind:this={container}>
  <button class="btn variant-ghost-primary w-full" on:click={() => (visible = !visible)}
    ><div class="flex w-full justify-between">
      <span>{buttonLabel}: <span class="font-thin">{selectedID + 1}</span></span>
      <svg class="h-6 w-6" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect stroke="#000" id="svg_1" height="200" width="200" y="0" x="0" fill="#fff" />
        <rect id="svg_2" height="180" width="180" y="10" x="10" fill={colors[selectedID]} />
      </svg>
    </div></button
  >

  {#if visible}
    <div
      class="card !bg-secondary-900/70 absolute z-50 flex flex-wrap justify-center p-1"
      style="{container.getBoundingClientRect().top - 400 > overlayHeight ? 'bottom' : 'top'}: 2.5rem;"
      bind:clientHeight={overlayHeight}
    >
      {#each colors as color, index}
        <button
          class="btn-icon btn-icon-sm m-0.5 hover:scale-110"
          style="background-color: {color}"
          on:click={() => selectID(index)}
        />
      {/each}
    </div>
  {/if}
</div>
