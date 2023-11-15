<script lang="ts">
  import { menuModals } from '$lib/script/modals';
  import { focusTrap } from '@skeletonlabs/skeleton';

  export let title: string;
  export let text: string;
  export let editable: boolean;
  export let id: string;
  function close(cancel = false) {
    menuModals.update((modals) => {
      return modals.filter((modal) => modal.id !== id);
    });
    alt.emit('modal:close', id, cancel ? undefined : text);
  }
</script>

<div class="flex flex-col h-[60vh] w-[60vw] p-4 bg-surface-800 gap-4 select-none" use:focusTrap={true}>
  <h2 class="h2">{title}</h2>
  {#if !editable}
    <p class="textarea whitespace-pre overflow-auto select-text" tabindex="-1">{text}</p>
  {:else}
    <textarea class="grow overflow-auto textarea select-text" bind:value={text} />
  {/if}
  <div class="flex gap-2 w-full justify-end">
    <button
      class="btn variant-ghost-success w-32"
      on:click={() => {
        close(!editable);
      }}>Ok</button
    >
    {#if editable}
      <button
        class="btn variant-ghost-error w-32"
        on:click={() => {
          close(true);
        }}>Cancel</button
      >
    {/if}
  </div>
</div>
