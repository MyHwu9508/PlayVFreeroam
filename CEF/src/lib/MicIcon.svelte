<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { isHudActive } from './store/hud';

  let showMicIcon = false;

  onMount(() => {
    alt.on('showMicIcon', setShowMicIcon);
  });

  onDestroy(() => {
    alt.off('showMicIcon', setShowMicIcon);
  });

  function setShowMicIcon(state: boolean) {
    showMicIcon = state;
  }
</script>

{#if $isHudActive && showMicIcon}
  <div
    transition:fly={{ duration: 200, x: 50 }}
    class="bg-success-600 i-carbon-microphone pointer-events-none fixed right-[1em] top-[1em] h-10 w-10"
  />
{/if}
