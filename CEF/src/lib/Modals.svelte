<script lang="ts">
  import TextArea from './components/modals/TextArea.svelte';
  import { menuModals } from './script/modals';
</script>

{#if $menuModals.length > 0}
  {@const modal = $menuModals[0]}
  <div class="fixed h-full w-full flex justify-center py-[10vh] bg-surface-800/60">
    {#if modal.type === 'textArea'}
      <TextArea title={modal.title} text={modal.text} editable={modal.editable} id={modal.id} />
    {/if}
  </div>
{/if}
