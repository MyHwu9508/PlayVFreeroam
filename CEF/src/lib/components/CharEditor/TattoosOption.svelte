<script lang="ts">
  import type { CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  import type { tattooData } from '$lib/script/tattooData';
  import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  export let data: CharEditorData;
  export let tattoos: (typeof tattooData)[string];
  let query = '';
  let hoveredTattoo: [number, number] | undefined = undefined;
  $: alt.emit('charCreator:hoverTattoo', hoveredTattoo);
</script>

<input type="text" bind:value={query} class="input h-12 sticky" placeholder="Search Tattoos..." />
<ListBox multiple>
  {#each tattoos as tattoo}
    {#if ((data.female && tattoo[0] == 'GENDER_FEMALE') || (!data.female && tattoo[0] == 'GENDER_MALE')) && (query == '' || tattoo[1]
          .toLowerCase()
          .includes(query.toLowerCase())) && !tattoo[1]?.includes('Hair')}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:mouseenter={() => (hoveredTattoo = [Number(tattoo[2]), Number(tattoo[3])])}
        on:mouseleave={() => (hoveredTattoo = undefined)}
      >
        <ListBoxItem
          bind:group={data.overlays}
          active="variant-filled-primary"
          hover="hover:variant-soft-primary"
          name="tattoo"
          value={`${tattoo[2]},${tattoo[3]}`}>{tattoo[1]}</ListBoxItem
        >
      </div>
    {/if}
  {/each}
</ListBox>
