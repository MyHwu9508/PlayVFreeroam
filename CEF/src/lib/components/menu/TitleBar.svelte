<script lang="ts">
  import { currentIndex, currentTitle, maxIndex } from '$lib/store/menu';
</script>

<div class="flex w-full gap-0.5">
  <span class="variant-filled-primary rounded-container-token grow p-1 text-center">{$currentTitle}</span>
  <span class="variant-filled-primary rounded-container-token flex items-center gap-1 p-1 px-2 text-right">
    <span style="min-width: {$maxIndex.toString().length}ch;">
      {#if $maxIndex < 0}
        0
      {:else}
        {$currentIndex + 1}
      {/if}
    </span>
    <span>|</span>
    <span>{$maxIndex + 1}</span>
  </span>
</div>
