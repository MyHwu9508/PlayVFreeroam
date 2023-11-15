<script lang="ts">
  import { onMount } from 'svelte';
  import { createWheelmenuRenderApp } from './script/wheelmenuRender';
  let container: HTMLDivElement;
  const TEST = [
    ['1', 'Item 1', 'This is item 1'],
    ['2', 'Item2', 'This is item 2'],
    ['3', 'Item3', 'This is item 3'],
    ['4', 'Item4', 'This is item 4'],
    ['5', 'Item5', 'This is item 5'],
  ];
  onMount(() => {
    const app = createWheelmenuRenderApp(container, TEST);
    container.appendChild(app.view as never);
    return app.destroy;
  });
</script>

<div bind:this={container} class="h-full w-full fixed flex items-center justify-center" />
