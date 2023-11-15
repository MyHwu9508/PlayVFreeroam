<script lang="ts">
  import { fly } from 'svelte/transition';

  let url: string = '';
  let showfallback: boolean = false;
  let showURL: boolean = false;
  let visible = false;

  function openWindow() {
    const newWindowProxy = window.open(url, '_blank');
    //newWindowProxy?.focus();
  }

  alt.on('discord:openFallbackWindow', (newUrl: string) => {
    url = newUrl;
    showfallback = true;
    visible = true;
  });

  alt.on('discord:openHelpWindow', () => {
    visible = true;
    showfallback = false;
  });

  alt.on('discord:hideHelpWindows', () => {
    visible = false;
  });
</script>

{#if visible}
  <div class="fixed bottom-[3rem] flex h-max w-full justify-center" transition:fly={{ duration: 500, y: 500 }}>
    {#if showfallback}
      <div class="card flex flex-col items-center p-8">
        <p class="!text-2xl font-bold">Click the button below to open the authentication in a new window.</p>
        <p class="text-error-500 font-thin">Automatic Discord authentication failed!</p>
        <button class="btn variant-filled-primary btn-xl my-8" on:click={openWindow}>
          Open Online Authentication<span class="i-carbon-logo-discord ml-2 text-3xl" />
        </button>
        {#if showURL}
          <p class="bg-surface-700 overflow-x-auto">{url}</p>
        {:else}
          <button class="btn variant-filled-surface btn-sm" on:click={() => (showURL = true)}> Show URL </button>
        {/if}
      </div>
    {:else}
      <div class="card flex select-none flex-col items-center p-8">
        <p class="!text-2xl font-bold">Automatic Discord Login Process started!</p>
        <p class="text-tertiary-400 !text-xl">Please check your Discord Application!</p>
      </div>
    {/if}
  </div>
{/if}
