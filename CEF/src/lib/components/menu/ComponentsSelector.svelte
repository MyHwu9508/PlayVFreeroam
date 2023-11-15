<script lang="ts">
  //@ts-nocheck
  import { onDestroy, onMount } from 'svelte';
  import { currentComponentID, currentIndex } from '$lib/store/menu';
  import type { BaseComponent } from '../../../../../src/playv/client/ui/menu/framework/components/BaseComponent';
  import Link from './components/Link.svelte';
  import Toggle from './components/Toggle.svelte';
  import Slider from './components/Slider.svelte';
  import Button from './components/Button.svelte';
  import Confirm from './components/Confirm.svelte';
  import Select from './components/Select.svelte';
  import Overlay from './components/Overlay.svelte';
  import Input from './components/Input.svelte';
  import ColorPicker from './components/ColorPicker.svelte';
  import NumberSelect from './components/NumberSelect.svelte';
  import Disabled from './components/Disabled.svelte';
  export let index: number;
  $: alt.emit('comp:get', index);
  let component: BaseComponent;

  onMount(() => {
    alt.on('comp:set', setComponent);
    alt.on('comp:refresh', refresh);
  });
  onDestroy(() => {
    alt.off('comp:set', setComponent);
    alt.off('comp:refresh', refresh);
  });

  function setComponent(target: number | string, data: any) {
    if (typeof target === 'number' && target === index) {
      component = data;
    } else if (component !== undefined && typeof target === 'string' && target === component.id) {
      component = data;
    }
  }

  function refresh() {
    alt.emit('comp:get', index);
  }

  $: selected = index === $currentIndex;
  $: selected && component !== undefined && component.id && currentComponentID.set(component.id);
</script>

{#key component?.id}
  <div class="{selected ? 'bg-primary-500/60' : ''} h-8 flex flex-col w-full justify-center">
    {#if component !== undefined && component !== null && 'type' in component}
      {#if component.type === 'toggle'}
        <Toggle comp={component} />
      {:else if component.type === 'slider'}
        <Slider comp={component} />
      {:else if component.type === 'link'}
        <Link comp={component} />
      {:else if component.type === 'button'}
        <Button comp={component} />
      {:else if component.type === 'confirm'}
        <Confirm comp={component} />
      {:else if component.type === 'select'}
        <Select comp={component} />
      {:else if component.type === 'numberSelect'}
        <NumberSelect comp={component} />
      {:else if component.type === 'overlay'}
        <Overlay comp={component} />
      {:else if component.type === 'input'}
        <Input comp={component} />
      {:else if component.type === 'color'}
        <ColorPicker comp={component} />
      {:else if component.type === 'disabled'}
        <Disabled text={component.text} />
      {:else}
        <span class="text-red-500">Unknown type: {component.type}</span>
      {/if}
    {/if}
  </div>
{/key}
