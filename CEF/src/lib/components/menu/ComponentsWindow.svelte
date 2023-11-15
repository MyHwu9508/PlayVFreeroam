<script lang="ts">
  import { flip } from 'svelte/animate';
  import { animateDuration, displayedIndeces, maxIndex, minHeight } from '$lib/store/menu';
  import ComponentsSelector from './ComponentsSelector.svelte';
</script>

<div class="rounded-container-token bg-surface-900/60 relative overflow-clip" style="min-height: {$minHeight}px;">
  {#each $displayedIndeces as i (i)}
    <div animate:flip={{ duration: $animateDuration * 0.6 }}>
      <ComponentsSelector index={i} />
    </div>
  {/each}
</div>
