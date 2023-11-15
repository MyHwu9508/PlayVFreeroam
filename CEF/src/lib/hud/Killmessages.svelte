<script lang="ts">
  import { fade, blur, fly, slide, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  import { isHudActive } from '$lib/store/hud';

  let currentData = {
    action: 'nothing',
    username: 'test',
  };
  let visible = false;
  let showTimeout: NodeJS.Timeout | undefined;

  alt.on('showKillmessage', showKillmessage);

  function showKillmessage(action: string, username: string) {
    currentData = {
      action,
      username,
    };
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = undefined;
    }
    visible = true;
    showTimeout = setTimeout(() => {
      showTimeout = undefined;
      visible = false;
    }, 3200 + username.length * 50);
  }
</script>

{#if isHudActive && visible}
  <div class="w-full h-full flex items-start justify-center pointer-events-none">
    <div
      class="flex flex-row items-center gap-2 text-xl px-4 py-2 rounded-token mt-5 bg-surface-500/60 border-primary-500 border-2"
      transition:fly={{ y: '-100%', duration: 200 }}
    >
      <span class="i-carbon-face-dizzy text-2xl" />
      <p>{currentData.username}</p>
    </div>
  </div>
{/if}
