<script lang="ts">
  import { currentComponentID } from '$lib/store/menu';
  import { onDestroy, onMount } from 'svelte';
  import type { ComponentContext, ContextDivider } from '../../../../../src/playv/client/ui/menu/framework/types';
  import ContextText from './ContextText.svelte';
  import { fade } from 'svelte/transition';
  let context: ComponentContext | undefined;
  onMount(() => {
    alt.on('comp:setContext', setContext);
    alt.on('comp:refresh', refresh);
    return currentComponentID.subscribe((value) => {
      alt.emit('comp:getContext', value);
    });
  });

  onDestroy(() => {
    alt.off('comp:setContext', setContext);
    alt.off('comp:refresh', refresh);
  });

  function setContext(id: string, newContext: ComponentContext) {
    if (id === $currentComponentID) {
      context = newContext;
    }
  }

  function refresh() {
    context = undefined;
    alt.emit('comp:getContext', $currentComponentID);
  }

  function getDividerStyle(div: ContextDivider) {
    let border = '';
    border += `border-color: ${div.color ?? 'white'};`;
    border += `border-bottom-width: ${div.width ?? 0.15}rem;`;
    let padding = '';
    padding += `padding-top: ${div.paddingTop ?? div.padding ?? 0.25}rem;`;
    padding += `padding-bottom: ${div.paddingBottom ?? div.padding ?? 0.25}rem;`;
    return { border, padding };
  }
</script>

{#if context && ((typeof context === 'string' && context.length > 0) || typeof context === 'object')}
  <div
    class="bg-surface-900/60 rounded-container-token p-2 text-center max-w-full overflow-clip"
    transition:fade={{ duration: 200 }}
  >
    {#if typeof context === 'string'}
      {@html context}
    {:else}
      <div class="flex flex-col w-full items-center">
        {#each context as ctx}
          {#if ctx.type === 'text'}
            <ContextText text={ctx} />
          {:else if ctx.type === 'divider'}
            {@const dividerStyle = getDividerStyle(ctx)}
            <div style={dividerStyle.padding} class="w-full">
              {#if ctx.linePosition === 'top'}
                <hr class="w-full grow" style={dividerStyle.border} />
              {/if}
              <div class="flex w-full items-center justify-center">
                {#if ctx.linePosition === 'center' || ctx.linePosition === undefined}
                  <hr class="w-full grow" style={dividerStyle.border} />
                {/if}
                <span class={ctx.title !== undefined ? 'px-2' : 'hidden'}>{ctx.title}</span>
                {#if ctx.linePosition === 'center' || ctx.linePosition === undefined}
                  <hr class="w-full grow" style={dividerStyle.border} />
                {/if}
              </div>
              {#if ctx.linePosition === 'bottom'}
                <hr class="w-full grow" style={dividerStyle.border} />
              {/if}
            </div>
          {:else if ctx.type === 'image'}
            <img src={ctx.src} alt="Rly cool trust bro" class="w-full" />
          {/if}
        {/each}
      </div>
    {/if}
  </div>
{/if}
