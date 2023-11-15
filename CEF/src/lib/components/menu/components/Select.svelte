<script lang="ts">
  import type { Select } from '../../../../../../src/playv/client/ui/menu/framework/components/Select';
  export let comp: Select;
</script>

<div class="flex justify-between w-full px-2">
  <span class="truncate">{comp.text}</span>
  <div class="flex items center -mr-1.5">
    <span class="i-carbon-chevron-left icon" />
    <span class="px-0.5 text-center">{comp.options?.[comp.index]}</span>
    <span class="i-carbon-chevron-right icon" />
  </div>
</div>
