<script lang="ts">
  import type { NumberSelect } from '../../../../../../src/playv/client/ui/menu/framework/components/NumberSelect';
  export let comp: NumberSelect;
</script>

<div class="flex justify-between w-full px-2">
  <span class="truncate">{comp.text}</span>
  <div class="flex items-center -mr-1.5">
    <span class="i-carbon-chevron-left icon" />
    <span class="text-center">
      {comp.value}
    </span>
    <span class="i-carbon-chevron-right icon" />
  </div>
</div>
