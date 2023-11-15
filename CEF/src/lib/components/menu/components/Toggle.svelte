<script lang="ts">
  import { SlideToggle } from '@skeletonlabs/skeleton';
  import type { Toggle } from '../../../../../../src/playv/client/ui/menu/framework/components/Toggle';
  export let comp: Toggle;
  let trueWidth: number;
  let falseWidth: number;
</script>

<div class="flex justify-between w-full items-center px-2">
  <span class="truncate">{comp.text}</span>
  {#if comp.style === 'checkbox'}
    {#if comp.value}
      <span class="i-carbon-checkbox-checked-filled icon" />
    {:else}
      <span class="i-carbon-checkbox icon" />
    {/if}
  {:else if comp.style === 'play'}
    {#if comp.value}
      <span class="i-carbon-pause-filled icon" />
    {:else}
      <span class="i-carbon-play icon text-sm" />
    {/if}
  {:else if comp.style === 'switch'}
    <SlideToggle
      name={comp.id}
      checked={comp.value}
      size="sm"
      background="bg-surface-300/75"
      active="bg-secondary-500"
    />
  {:else if Array.isArray(comp.style)}
    <div class="flex px-1 relative rounded-container-token gap-2">
      <span
        class="text-transparent bg-secondary-500 absolute rounded-token px-1 transition-all {!comp.value
          ? 'ml-1'
          : 'ml-3'}"
        style="width: {!comp.value ? falseWidth : trueWidth}px;left: {!comp.value ? 0 : falseWidth}px;">A</span
      >
      <span class="z-10 px-1" bind:clientWidth={falseWidth}>{comp.style?.[1] ?? '???'}</span>
      <span class="z-10 px-1" bind:clientWidth={trueWidth}>{comp.style?.[0] ?? '???'}</span>
    </div>
  {/if}
</div>
