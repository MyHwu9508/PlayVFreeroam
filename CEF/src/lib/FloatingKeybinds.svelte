<script lang="ts">
  import { fly } from 'svelte/transition';
  import { isHudActive } from './store/hud';

  type FloatingKeybinds = string[][];

  let buttons: FloatingKeybinds = [];

  alt.on('refreshHelpButtons', refreshHelpButtons);

  function refreshHelpButtons(data: FloatingKeybinds) {
    if (!data) {
      buttons = [];
      return;
    }
    buttons = data;
  }
</script>

{#if $isHudActive}
  <div class="pointer-events-none fixed" style="left:0.5em;top:45%;">
    {#each buttons as keybind, i}
      <div
        class="flex flex-row items-center gap-2 pt-1"
        style="text-shadow: 1px 1px 1px black;"
        transition:fly={{ x: '-100%', delay: i * 200, duration: 250 }}
      >
        <div
          class="border-primary-500/40 bg-surface-800/20 text-surface-100 flex !h-8 !w-8 items-center justify-center rounded-full border-4 text-sm font-semibold"
        >
          <p>{keybind[0]}</p>
        </div>
        <p class="text-surface-100 font-semibold">{keybind[1]}</p>
      </div>
    {/each}
  </div>
{/if}
