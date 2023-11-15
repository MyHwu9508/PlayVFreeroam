<script lang="ts">
  import type { Confirm } from '../../../../../../src/playv/client/ui/menu/framework/components/Confirm';
  export let comp: Confirm;
</script>

<div
  class="px-gap flex items-center justify-between w-[201%] transition-transform {comp.active
    ? '-translate-x-[50%]'
    : '-translate-x-0'}"
>
  <span class="truncate w-1/2 pl-2">{comp.text}</span>
  <div
    class="w-1/2 h-8 px-2 flex justify-between items-center"
    style="background-color: rgb(var(--color-{comp.color}-500));"
  >
    <span class="truncate">{comp.confirm}</span>
    <span class="i-carbon-send-filled icon" />
  </div>
</div>
