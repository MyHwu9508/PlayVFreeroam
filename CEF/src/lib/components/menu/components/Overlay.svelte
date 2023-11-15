<script lang="ts">
  import { minHeight } from '$lib/store/menu';
  import type { Overlay } from '../../../../../../src/playv/client/ui/menu/framework/components/Overlay';
  export let comp: Overlay;
  let containerWidth: number;
  let overlayHeight: number;
  $: setMenuMinHeight(comp.active, overlayHeight);
  function setMenuMinHeight(active: boolean, height: number) {
    if (active) {
      minHeight.set(height);
    } else {
      minHeight.set(0);
    }
  }
</script>

<div class="flex justify-between w-full px-2" bind:clientWidth={containerWidth}>
  <span class="truncate">{comp.text}</span><span class="i-carbon-list icon text-lg" />
</div>
{#if comp.active}
  <div class="absolute h-full w-full bg-surface-900/80 z-10 bottom-0 flex-col flex justify-center overflow-visible">
    <div class="flex flex-col justify-center" bind:clientHeight={overlayHeight}>
      {#each comp.inputs as input, i (input)}
        <div class="h-6 flex w-full justify-between px-2 {i === comp.currentIndex ? 'bg-primary-500/60' : ''}">
          {#if typeof input === 'string'}
            <span class="truncate">{input}</span>
          {:else}
            <span class="truncate">{input[0]}</span>
            {#if input[1]}
              <span class="i-carbon-checkbox-checked-filled icon" />
            {:else}
              <span class="i-carbon-checkbox icon" />
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
