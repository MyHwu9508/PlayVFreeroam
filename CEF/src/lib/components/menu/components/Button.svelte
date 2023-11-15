<script lang="ts">
  import type { Button } from '../../../../../../src/playv/client/ui/menu/framework/components/Button';
  export let comp: Button;
  function getStyle(comp: Button) {
    let style = '';
    if (comp.size !== undefined) style += `font-size: ${comp.size}rem;`;
    if (comp.color !== undefined)
      style +=
        comp.color in ['white', 'black'] ? `color: ${comp.color};` : `color: rgb(var(--color-${comp.color}-500));`;
    if (comp.font !== undefined) style += `font: ${comp.font};`;
    return style;
  }
  $: lineColor =
    comp.lineColor === undefined
      ? comp.color in ['white', 'black']
        ? `border-color: ${comp.color};`
        : `border-color: rgb(var(--color-${comp.color}-500));`
      : comp.lineColor in ['white', 'black']
      ? `border-color: ${comp.lineColor};`
      : `border-color: rgb(var(--color-${comp.lineColor}-500));`;
</script>

<div class="flex flex-col justify-left w-full px-2">
  <div class="flex justify-between items-center">
    <span class="truncate" style={getStyle(comp)}>{comp.text}</span>
    {#if comp.trailing}
      <span class="pr-0.5" style={getStyle(comp)}>{comp.trailing}</span>
    {/if}
  </div>
  {#if comp.line}
    <hr class="grow w-full border-b-2" style={lineColor} />
  {/if}
</div>
