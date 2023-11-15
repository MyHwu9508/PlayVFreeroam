<script lang="ts">
  import type { CharEditorMetaData } from '../../../../../src/playv/shared/types/charCreatorData';
  export let metadata: CharEditorMetaData;
  let confirm = '';
  const MENU_OPTIONS = [
    {
      action: 'COMMIT',
      heading: 'Save Character',
      description: "Overwrite the character you're currently editing.",
    },
    {
      action: 'DISCARD',
      heading: 'Discard Character',
      description: "Discard the changes made to the character you're currently editing.",
    },
  ];

  function finishEdit() {
    alt.emit('characterCreator:finishEdit', confirm, metadata);
  }
</script>

{#each MENU_OPTIONS as option}
  {#if confirm === option.action}
    <div class="grid w-full space-y-4">
      <div>
        <h2 class="text-primary-500">{option.heading}</h2>
        <p class="pl-1 text-xl">{option.description}</p>
      </div>
      <button class="btn btn-lg variant-ghost-success" on:click={finishEdit}>Confirm</button>
      <button class="btn btn-lg variant-ghost-error" on:click={() => (confirm = '')}>Cancel</button>
    </div>
  {/if}
{/each}

{#if confirm === ''}
  <div class="grid space-y-4">
    {#if metadata.profileName !== undefined && metadata.profileName.length > 0}
      <button class="btn btn-lg variant-ghost-warning" on:click={() => (confirm = 'COMMIT')}>Save Character</button>
    {:else}
      <button class="btn btn-lg variant-soft-warning" disabled>Enter name!</button>
    {/if}
    <button class="btn btn-lg variant-ghost-error" on:click={() => (confirm = 'DISCARD')}>Discard Character</button>
  </div>
{/if}
