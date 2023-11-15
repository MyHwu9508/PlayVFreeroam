<script lang="ts">
  import type { ContextText } from '../../../../../src/playv/client/ui/menu/framework/types';

  export let text: ContextText;
  function getStyle(text: ContextText) {
    let style = '';
    if (text.size !== undefined) style += `font-size: ${text.size}rem;`;
    if (text.color !== undefined) style += `color: ${text.color};`;
    if (text.font !== undefined) style += `font: ${text.font};`;
    return style;
  }
</script>

<p class="whitespace-pre-wrap inline">
  {#if typeof text.text === 'string'}
    <span style={getStyle(text)}>{text.text}</span>
  {:else}
    {#each text.text as part}
      {#if typeof part === 'string'}
        <span style={getStyle(text)}>{part}</span>
      {:else if typeof part === 'object'}
        <svelte:self text={part} />
      {/if}
    {/each}
  {/if}
</p>
