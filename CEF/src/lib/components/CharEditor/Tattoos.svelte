<script lang="ts">
  import { tattooData } from '$lib/script/tattooData';
  import { Accordion, AccordionItem, RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
  import type { CharEditorData } from '../../../../../src/playv/shared/types/charCreatorData';
  import TattoosOption from './TattoosOption.svelte';

  export let data: CharEditorData;
  const zones: Record<string, string> = {
    ZONE_HEAD: 'Head',
    ZONE_TORSO: 'Torso',
    ZONE_LEFT_ARM: 'L Arm',
    ZONE_RIGHT_ARM: 'R Arm',
    ZONE_LEFT_LEG: 'L Leg',
    ZONE_RIGHT_LEG: 'R Leg',
  };
  let selectedZone = 'ZONE_HEAD';
</script>

<div class="h-full w-full">
  <RadioGroup display="flex sticky">
    {#each Object.keys(zones) as zone}
      <RadioItem bind:group={selectedZone} value={zone} name="zone">{zones[zone]}</RadioItem>
    {/each}
  </RadioGroup>
  <TattoosOption bind:data tattoos={tattooData[selectedZone]} />
</div>
