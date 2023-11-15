<script lang="ts">
  import { fly } from 'svelte/transition';
  import ComponentsWindow from './components/menu/ComponentsWindow.svelte';
  import ContextWindow from './components/menu/ContextWindow.svelte';
  import TitleBar from './components/menu/TitleBar.svelte';
  import { currentTitle, menuVisible, menuSide, menuX, menuY, menuWidth } from './store/menu';
</script>

{#if $menuVisible}
  <div
    class="absolute h-full"
    style="{$menuSide}: {$menuX}%; top: {$menuY}%; width: {$menuWidth}rem;"
    transition:fly={{ x: '-100%', duration: 200 }}
  >
    {#key $currentTitle}
      <div class="flex h-full w-full flex-col gap-1">
        <TitleBar />
        <ComponentsWindow />
        <ContextWindow />
      </div>
    {/key}
  </div>
{/if}
