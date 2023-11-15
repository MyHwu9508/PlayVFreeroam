<script lang="ts">
  import ColorPicker from '$lib/components/colorPicker/ColorPicker.svelte';
  import { minHeight } from '$lib/store/menu';
  import type { ColorPicker as Color } from '../../../../../../src/playv/client/ui/menu/framework/components/ColorPicker';
  export let comp: Color;
  let containerWidth: number;
  let overlayHeight: number;
  function handleFinish(e: KeyboardEvent) {
    if (!comp.active) return;
    if (e.key === 'Enter') {
      alt.emit('comp:finish', true);
    } else if (e.key === 'Escape') {
      alt.emit('comp:finish', false);
    }
  }
  $: setMenuMinHeight(comp.active, overlayHeight);
  function setMenuMinHeight(active: boolean, height: number) {
    if (active) {
      minHeight.set(height);
    } else {
      minHeight.set(0);
    }
  }
</script>

<svelte:window on:keydown={handleFinish} />

<div class="flex justify-between w-full px-2 items-center" bind:clientWidth={containerWidth}>
  <span class="truncate">{comp.text}</span>
  <div class="h-6 w-6 border-2 border-white" style="background-color: {comp.hex};" />
</div>
{#if comp.active}
  <div class="absolute h-full w-full bg-surface-900/80 z-10 bottom-0 flex-col flex justify-center overflow-visible">
    <div class="flex-col flex justify-center gap-1 p-2 h-[22rem]" bind:clientHeight={overlayHeight}>
      <!-- svelte-ignore missing-declaration -->
      <ColorPicker alpha={comp.alpha} value={comp.hex} on:input={(e) => alt.emit('comp:input', e.detail)} />
      <div class="flex w-full gap-1">
        <!-- svelte-ignore missing-declaration -->
        <button class="btn variant-ghost-error grow" on:click={() => alt.emit('comp:finish', false)}>Cancel</button>
        <!-- svelte-ignore missing-declaration -->
        <button class="btn variant-ghost-success grow" on:click={() => alt.emit('comp:finish', true)}>Confirm</button>
      </div>
    </div>
  </div>
{/if}
