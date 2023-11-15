<script lang="ts">
  import { fade } from 'svelte/transition';
  import { tick } from 'svelte';
  const inputLength = 20;
  let value = '';
  let visible = false;
  let inputEl: HTMLInputElement;

  alt.on('setUsernameWindow', async (status) => {
    visible = status;
    await tick();
    inputEl?.focus();
  });

  function submitUsername(e: Event) {
    e.preventDefault();
    alt.emit('usernameSelected', value);
  }

  function keyUp(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      e.preventDefault();
      alt.emit('usernameSelected', value);
    }
  }
</script>

{#if visible}
  <div
    class="fixed flex h-full w-full select-none items-center justify-center gap-2"
    transition:fade={{ duration: 250 }}
  >
    <div class="bg-surface-800/50 rounded-container-token flex flex-col items-center gap-2 p-4">
      <p class="text-2xl font-semibold">Enter your new username!</p>
      <div class="flex flex-row items-center gap-3">
        <span class="i-carbon-warning bg-error-500 p-3" />
        <p class="text-error-500 max-w-[40vw] font-semibold">You can only change your username once every 7 days</p>
        <span class="i-carbon-warning bg-error-500 p-3" />
      </div>
      <input
        class="input w-full p-1 pl-3 text-center text-2xl"
        bind:value
        maxlength={inputLength}
        bind:this={inputEl}
        on:keyup={keyUp}
      />
      <button class="btn variant-ghost-success w-full font-semibold" on:click={submitUsername}>Submit</button>
    </div>
  </div>
{/if}
